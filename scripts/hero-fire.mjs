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

// The digital pan is a hollow wireframe bowl (rim at y~374, floor at ~396 in
// the 700px artboard), so its flame has to burn INSIDE it: it reaches down to
// the floor, widens to the walls, and the bowl's front wires sit in front of
// it. The brass pan is solid metal, so its flame stands on top as before.
// Texture pixels are 2x the artboard, the same scale as the 1400px artwork, so
// the bowl can be read straight off the photograph.
const BOWL={rim:374,front:379,floor:397,cx:514};
async function readBowl(){
  const {data,info}=await sharp('src/assets/images/hero-statue-1400.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const W=info.width;
  // The mesh colour test used for the material mask in build-hero-rive.mjs.
  const wire=(x,y)=>{
    const p=(y*W+x)*4,r=data[p],g=data[p+1],b=data[p+2];
    return data[p+3]/255*clamp((b-r-22)/25)*clamp((g-r-10)/18);
  };
  // Per artboard-row walls of the bowl, from its wire extent.
  const walls=new Map();
  for(let y=BOWL.rim*2;y<=BOWL.floor*2;y++){
    let min=Infinity,max=-Infinity;
    for(let x=(BOWL.cx-50)*2;x<=(BOWL.cx+50)*2;x++)if(wire(x,y)>.3){min=Math.min(min,x);max=Math.max(max,x);}
    if(max>min)walls.set(y,[min,max]);
  }
  return {wire,walls};
}

export async function buildFire(id){
  let content='',assets='',timeline='';
  const count=240,cycle=480,bowl=await readBowl();
  const pans=[
    // [name, centre x, seed, texture width, texture height, left, top] in texture px / artboard units
    ['digital',BOWL.cx,319,168,(BOWL.floor-319)*2,BOWL.cx-42,319],
    ['brass',658,947,144,120,658-36,319],
  ];
  for(const [pan,cx,seed,width,height,left,top] of pans){
    const hollow=pan==='digital';
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
        const px=left*2+x,py=top*2+y,inBowl=hollow&&py>=BOWL.rim*2;
        let widthAtHeight=.72*(1-rise*.85),wallFade=1;
        if(hollow){
          // Above the rim, the same taper the flame always had; inside the
          // bowl it widens to meet the walls, so the fire fills the bowl.
          const aboveRim=clamp((BOWL.rim*2-py)/((BOWL.rim-top)*2));
          widthAtHeight=inBowl?.78:.7*(1-aboveRim*.85)+.05;
          if(inBowl){
            const w=bowl.walls.get(py);
            wallFade=w?clamp((px-w[0]-3)/5)*clamp((w[1]-3-px)/5):0;
          }
        }
        const envelope=1-Math.abs(u)/widthAtHeight;
        const heat=clamp(envelope*.7+(n-.4)*.75+(fine-.5)*.27+(wisps-.5)*.08-rise*.6+(inBowl?.12:0));
        const alpha=clamp((heat-.05)*2.1)*clamp((1-rise)*12)*clamp((1-Math.abs(side))*10)*wallFade;
        const hot=clamp(heat*1.65),p=(y*width+x)*4;
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
    if(hollow){
      // The near half of the bowl is in front of the fire: its wires cut it,
      // so it reads as burning inside the cage. One static layer of black
      // over the frames does that, because the canvas is screen-blended and
      // black at alpha a multiplies what is under it by 1-a. Baked into every
      // frame instead, the wire pattern cost ~1MB of the .riv. The light
      // textures draw after this, so the wires keep their shimmer.
      const rgba=Buffer.alloc(width*height*4);
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const px=left*2+x,py=top*2+y;
        if(py>=BOWL.front*2)rgba[(y*width+x)*4+3]=Math.round(255*.85*bowl.wire(px,py));
      }
      const name=`fire-${pan}-front`,file=`layers/${name}.webp`,asset=id();
      writeFileSync(`art/rive/hero/${file}`,await toWebp(await sharp(rgba,{raw:{width,height,channels:4}}).blur(.45).png().toBuffer()));
      assets+=`<ImageAsset id="${asset}" name="${name}" file="${file}"/>`;
      content+=`<Node id="${id()}" name="${name}"><Image assetId="${asset}" x="${left}" y="${top}" originX="0" originY="0" scaleX="0.5" scaleY="0.5"/></Node>`;
    }
  }
  return {content,assets,timeline};
}
