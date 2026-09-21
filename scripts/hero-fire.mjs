import sharp from 'sharp';

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

export async function buildFire(id){
  let content='',assets='',timeline='';
  const width=144,height=120,count=240,cycle=480;
  for(const [pan,cx,seed] of [['digital',514,319],['brass',658,947]]){
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
        const widthAtHeight=.72*(1-rise*.85);
        const envelope=1-Math.abs(u)/widthAtHeight;
        const heat=clamp(envelope*.7+(n-.4)*.75+(fine-.5)*.27+(wisps-.5)*.08-rise*.6);
        const alpha=clamp((heat-.05)*2.1)*clamp((1-rise)*12)*clamp((1-Math.abs(side))*10);
        const hot=clamp(heat*1.65),p=(y*width+x)*4;
        // Hot core → saturated body → transparent edge, not opaque silhouettes.
        if(pan==='brass'){
          rgba[p]=255;rgba[p+1]=Math.round(100+155*Math.pow(hot,.6));rgba[p+2]=Math.round(18+218*Math.pow(hot,2.2));
        }else{
          rgba[p]=Math.round(62+185*Math.pow(hot,1.4));rgba[p+1]=Math.round(133+117*hot);rgba[p+2]=255;
        }
        rgba[p+3]=Math.round(alpha*225);
      }
      const name=`fire-${pan}-${frame}`,file=`layers/${name}.png`,asset=id(),node=id();
      await sharp(rgba,{raw:{width,height,channels:4}}).blur(.45).png({palette:true,quality:95,dither:0}).toFile(`art/rive/hero/${file}`);
      assets+=`<ImageAsset id="${asset}" name="${name}" file="${file}"/>`;
      content+=`<Node id="${node}" name="${name}" opacity="0"><Image assetId="${asset}" x="${cx-36}" y="319" originX="0" originY="0" scaleX="0.5" scaleY="0.5"/></Node>`;
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
  }
  return {content,assets,timeline};
}
