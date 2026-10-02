import { writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { toWebp } from './webp-exact.mjs';

// Small precomputed fluid-light textures. Only the two adjacent frames in each
// pan are visible; Rive crossfades at display refresh rate, with no live noise.
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>x*x*(3-2*x);
function hash(x,y,seed){
  let n=Math.imul(x,374761393)^Math.imul((y%32+32)%32,668265263)^seed;
  n=Math.imul(n^(n>>>13),1274126177);
  return ((n^(n>>>16))>>>0)/4294967295;
}
function noise(x,y,seed){
  const ix=Math.floor(x),iy=Math.floor(y),u=smooth(x-ix),v=smooth(y-iy);
  const a=hash(ix,iy,seed),b=hash(ix+1,iy,seed),c=hash(ix,iy+1,seed),d=hash(ix+1,iy+1,seed);
  return (a+(b-a)*u)*(1-v)+(c+(d-c)*u)*v;
}

// Both pans are bowls, and each flame burns INSIDE its bowl: it reaches down
// to the floor, widens to the walls, and the bowl's front wall sits in front of
// it. The digital pan is a hollow wireframe, so its fire shows between the
// front wires; the brass pan is solid metal, so its front wall hides the fire
// below the rim entirely, but it burns from the same place. Rows are in the
// 700px artboard. Texture pixels are 2x the artboard, the same scale as the
// 1400px artwork, so each bowl can be read straight off the photograph.
const BOWLS={
  digital:{rim:374,front:379,floor:397,cx:514},
  brass:{rim:376,front:379,floor:397,cx:658},
};
async function readBowls(){
  const {data,info}=await sharp('src/assets/images/hero-statue-1400.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const W=info.width;
  const alpha=(x,y)=>data[(y*W+x)*4+3]/255;
  // The mesh colour test used for the material mask in build-hero-rive.mjs.
  const wire=(x,y)=>{
    const p=(y*W+x)*4,r=data[p],g=data[p+1],b=data[p+2];
    return alpha(x,y)*clamp((b-r-22)/25)*clamp((g-r-10)/18);
  };
  // What stands in front of each fire: the wires at 85%, or opaque metal.
  const occluder={digital:(x,y)=>.85*wire(x,y),brass:alpha};
  const material={digital:wire,brass:alpha};
  const bowls={};
  for(const [pan,bowl] of Object.entries(BOWLS)){
    // Per-row walls of the bowl, from its material's extent.
    const walls=new Map();
    for(let y=bowl.rim*2;y<=bowl.floor*2;y++){
      let min=Infinity,max=-Infinity;
      for(let x=(bowl.cx-50)*2;x<=Math.min(W-1,(bowl.cx+50)*2);x++)if(material[pan](x,y)>.3){min=Math.min(min,x);max=Math.max(max,x);}
      if(max>min)walls.set(y,[min,max]);
    }
    bowls[pan]={...bowl,walls,occluder:occluder[pan]};
  }
  return bowls;
}

export async function buildFire(id){
  let content='',assets='',timeline='';
  const count=240,cycle=480,bowls=await readBowls(),top=319;
  // [name, seed]; each texture spans the bowl's width and runs from the flame
  // tip down to the bowl's floor.
  for(const [pan,seed] of [['digital',319],['brass',947]]){
    const bowl=bowls[pan],width=168,height=(bowl.floor-top)*2,left=bowl.cx-42;
    // Behind opaque metal the occluder below paints solid black, so whatever
    // a frame holds there never reaches the screen. Leave those pixels empty
    // (with a margin for the blur) and the hidden fire costs nothing.
    const hidden=new Uint8Array(width*height);
    for(let y=2;y<height-2;y++)for(let x=2;x<width-2;x++){
      const px=left*2+x,py=top*2+y;
      let solid=py>=bowl.front*2+2;
      for(let dy=-2;solid&&dy<=2;dy++)for(let dx=-2;solid&&dx<=2;dx++)solid=bowl.occluder(px+dx,py+dy)>=.99;
      hidden[y*width+x]=solid?1:0;
    }
    for(let frame=0;frame<count;frame++){
      // Reverse the sampled sequence: decreasing noise phase makes features
      // travel toward increasing `rise` (up from the bowl), not down into it.
      const phase=-frame/count,rgba=Buffer.alloc(width*height*4);
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const rise=1-y/(height-1),side=(x-width/2)/(width/2);
        const drift=.12*Math.sin(rise*7-phase*Math.PI*2)+.06*Math.sin(rise*17+phase*Math.PI*4);
        const u=side-drift*rise;
        const n=noise(u*4+11,rise*5+phase*32,seed);
        const fine=noise(u*11+31,rise*14+phase*64,seed+1);
        const wisps=noise(u*23+37,rise*28+phase*96,seed+2);
        // Photo-space pixel under this texture pixel (only meaningful in the bowl).
        const px=left*2+x,py=top*2+y,inBowl=py>=bowl.rim*2;
        // Above the rim, the same taper the flame always had; inside the
        // bowl it widens to meet the walls, so the fire fills the bowl.
        const aboveRim=clamp((bowl.rim*2-py)/((bowl.rim-top)*2));
        const widthAtHeight=inBowl?.78:.7*(1-aboveRim*.85)+.05;
        let wallFade=1;
        if(inBowl){
          const w=bowl.walls.get(py);
          wallFade=w?clamp((px-w[0]-3)/5)*clamp((w[1]-3-px)/5):0;
        }
        const envelope=1-Math.abs(u)/widthAtHeight;
        const heat=clamp(envelope*.7+(n-.4)*.75+(fine-.5)*.27+(wisps-.5)*.08-rise*.6+(inBowl?.12:0));
        const alpha=clamp((heat-.05)*2.1)*clamp((1-rise)*12)*clamp((1-Math.abs(side))*10)*wallFade;
        const hot=clamp(heat*1.65),p=(y*width+x)*4;
        if(hidden[y*width+x])continue;
        // Hot core → saturated body → transparent edge, not opaque silhouettes.
        if(pan==='brass'){
          rgba[p]=255;rgba[p+1]=Math.round(100+155*Math.pow(hot,.6));rgba[p+2]=Math.round(18+218*Math.pow(hot,2.2));
        }else{
          rgba[p]=Math.round(62+185*Math.pow(hot,1.4));rgba[p+1]=Math.round(133+117*hot);rgba[p+2]=255;
        }
        rgba[p+3]=Math.round(alpha*225);
      }
      const name=`fire-${pan}-${frame}`,file=`layers/${name}.webp`,asset=id(),node=id();
      // Quantised exactly as before, then stored as exact lossless WebP.
      const quantised=await sharp(rgba,{raw:{width,height,channels:4}}).blur(.45).png({palette:true,quality:95,dither:0}).toBuffer();
      writeFileSync(`art/rive/hero/${file}`,await toWebp(quantised));
      assets+=`<ImageAsset id="${asset}" name="${name}" file="${file}"/>`;
      content+=`<Node id="${node}" name="${name}" opacity="0"><Image assetId="${asset}" x="${left}" y="${top}" originX="0" originY="0" scaleX="0.5" scaleY="0.5"/></Node>`;
      // 240 samples / eight seconds (30 fps), linearly blended. Integer frame
      // positions keep the authoring clock valid while rendering stays smooth.
      const keys=new Map([[0,frame===0?1:0],[1440,frame===0?1:0]]);
      for(let repeat=-1;repeat<=Math.ceil(1440/cycle);repeat++){
        const center=repeat*cycle+Math.round(frame*cycle/count);
        for(const [offset,value] of [[-1,0],[0,1],[1,0]]){
          const at=repeat*cycle+Math.round((frame+offset)*cycle/count);
          if(at>=0&&at<=1440)keys.set(at,value);
        }
        if(center>1440)break;
      }
      const frames=[...keys].sort((a,b)=>a[0]-b[0]).map(([at,value])=>`<KeyFrameDouble frame="${at}" value="${value}" interpolationType="linear"/>`).join('');
      timeline+=`<KeyedObject objectId="${node}"><KeyedProperty propertyKey="18">${frames}</KeyedProperty></KeyedObject>`;
    }
    {
      // The near half of the bowl is in front of the fire: the wires cut it,
      // so it reads as burning inside the cage, and the metal hides it. One
      // static layer of black over the frames does that, because the canvas is
      // screen-blended and black at alpha a multiplies what is under it by 1-a.
      // Baked into every frame instead, the wire pattern cost ~1MB of the .riv.
      // The light textures draw after this, so the wires keep their shimmer.
      const rgba=Buffer.alloc(width*height*4);
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const px=left*2+x,py=top*2+y;
        if(py>=bowl.front*2)rgba[(y*width+x)*4+3]=Math.round(255*bowl.occluder(px,py));
      }
      const name=`fire-${pan}-front`,file=`layers/${name}.webp`,asset=id();
      writeFileSync(`art/rive/hero/${file}`,await toWebp(await sharp(rgba,{raw:{width,height,channels:4}}).blur(.45).png().toBuffer()));
      assets+=`<ImageAsset id="${asset}" name="${name}" file="${file}"/>`;
      content+=`<Node id="${id()}" name="${name}"><Image assetId="${asset}" x="${left}" y="${top}" originX="0" originY="0" scaleX="0.5" scaleY="0.5"/></Node>`;
    }
  }
  return {content,assets,timeline};
}
