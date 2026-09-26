// Native Rive energized fragments: masked facets, 24 independent light groups.
import { writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { ULTRAMARINE_COLORS } from '../src/components/DigitalStatue/sceneColors.ts';
import { buildFire } from './hero-fire.mjs';
// Match the drawing's blue, not a palette fill. Bake all bloom at build time.
const glow = `rgb(${ULTRAMARINE_COLORS.secondary})`;
const light = `rgb(${ULTRAMARINE_COLORS.accent})`;
const core = `rgb(${ULTRAMARINE_COLORS.accentBright})`;
let serial=10;
const id=()=>`0:${serial++}`;
let seed=72663863;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
mkdirSync('public/animations',{recursive:true});

// Canonical cyan artwork gives an unambiguous material mask even when the
// visitor chooses gold or white artwork. Do not confuse warm marble with mesh.
const {data,info}=await sharp('src/assets/images/hero-statue-700.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
// Leave the sword's baked artwork alone: blade, crossguard and exposed grip.
// Coordinates share the artwork's 700px frame, independent of the chosen colour.
const swordRegions=[
  // The blade continues into the shin mesh; include its full tapered tip.
  [[175,522],[205,516],[330,786],[318,814],[300,803]],
  [[141,522],[217,484],[231,505],[151,548]],
  [[146,423],[165,420],[185,477],[165,490]],
];
// Follow the leg-side edge through the three annotated patches, rather than
// leaving rectangular gaps between them. The diagonal left boundary stays on
// the leg side of the sword; source colour still excludes marble and holes.
const legMeshPatches=[
  [[239,600],[355,600],[355,800],[306,800],[300,770],[285,728],[269,690],[253,648]],
];
const inPolygon=(x,y,points)=>{
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [xi,yi]=points[i],[xj,yj]=points[j];
    if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
  }
  return inside;
};
const onSword=(x,y)=>swordRegions.some(points=>inPolygon(x,y,points))
  &&!legMeshPatches.some(points=>inPolygon(x,y,points));
const mask=Buffer.alloc(info.width*info.height*4);
for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++){
  const p=(y*info.width+x)*4;
  const r=data[p],g=data[p+1],b=data[p+2];
  const blue=Math.min(1,Math.max(0,(b-r-22)/25))*Math.min(1,Math.max(0,(g-r-10)/18));
  const body=x<355 ? blue:0;
  const pan=x>466&&x<564&&y>230&&y<405 ? blue:0;
  mask[p]=mask[p+1]=mask[p+2]=255;
  mask[p+3]=onSword(x,y)?0:Math.round(data[p+3]*Math.max(body,pan));
}
await sharp(mask,{raw:{width:info.width,height:info.height,channels:4}}).png().toFile('public/animations/statue-digital-mask.png');
const allowed=(x,y)=>{
  x=Math.round(x);y=Math.round(y);
  return x>=0&&x<info.width&&y>=0&&y<info.height&&mask[(y*info.width+x)*4+3]>45;
};
// Organic patches of fragments with breathing room between them. A smooth,
// deterministic density field varies spacing across the actual digital material.
const groups=Array.from({length:24},()=>({paths:[]}));
const facets=[],centers=[],buckets=new Map();
const pixels=[];
for(let y=48;y<info.height-3;y++)for(let x=120;x<564;x++){
  if(allowed(x,y))pixels.push([x,y]);
}
for(let i=pixels.length-1;i>0;i--){
  const j=Math.floor(random()*(i+1));
  [pixels[i],pixels[j]]=[pixels[j],pixels[i]];
}
const neighbors=(x,y)=>{
  const found=[],bx=Math.floor(x/8),by=Math.floor(y/8);
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)
    found.push(...(buckets.get(`${bx+dx}:${by+dy}`)??[]));
  return found;
};
for(const [x,y] of pixels){
  const scale=x>466;
  const cluster=(Math.sin(x*.049+y*.023)+Math.sin(y*.079-x*.018)+2)/4;
  // Accentuate only the already-masked leg material beside the diagonal blade.
  // Never widen eligibility: the sword exclusion also clips every baked bloom.
  const legEdge=legMeshPatches.some(points=>inPolygon(x,y,points));
  const spacing=scale?2.8+cluster*3.2:(4.5+cluster*6)*(legEdge?.58:1);
  const near=neighbors(x,y);
  if(near.some(p=>Math.hypot(p.x-x,p.y-y)<(spacing+p.spacing)*.5))continue;
  const size=scale?.8+random()*1.25:1.4+random()*2.8;
  const skew=(random()-.5)*size*.8;
  const facet=[[x-size,y-size*.7],[x+size,y-size*.7+skew],[x+size*.8,y+size*.7],[x-size*.8,y+size*.7-skew]];
  // Avoid bright synchronized patches: closest neighbors use other phases.
  const used=new Set(near.filter(p=>Math.hypot(p.x-x,p.y-y)<16).map(p=>p.group));
  const choices=groups.map((_,i)=>i).filter(i=>!used.has(i));
  const group=choices.length?choices[Math.floor(random()*choices.length)]:Math.floor(random()*24);
  groups[group].paths.push(facet);
  facets.push(facet);
  const center={x,y,group,spacing};
  centers.push(center);
  const key=`${Math.floor(x/8)}:${Math.floor(y/8)}`;
  if(!buckets.has(key))buckets.set(key,[]);
  buckets.get(key).push(center);
}
// Quantify coverage of eligible material, including narrow chains. Every pixel
// must have a nearby fragment center; empty transparent gaps are not material.
const regions=[
  ['face',120,355,48,205],['torso/arm',120,355,205,510],
  ['leg',120,355,510,825],['base',120,355,825,info.height],
  ['digital scale',466,564,230,405],
];
const coverage=regions.map(([name,x0,x1,y0,y1])=>{
  const distances=pixels.filter(([x,y])=>x>=x0&&x<x1&&y>=y0&&y<y1)
    .map(([x,y])=>Math.min(...neighbors(x,y).map(p=>Math.hypot(p.x-x,p.y-y)))).sort((a,b)=>a-b);
  return {region:name,pixels:distances.length,centers:centers.filter(p=>p.x>=x0&&p.x<x1&&p.y>=y0&&p.y<y1).length,
    p95Distance:distances[Math.floor(distances.length*.95)]?.toFixed(2),maxDistance:distances.at(-1)?.toFixed(2)};
});
console.table(coverage);
if(coverage.some(r=>Number(r.maxDistance)>(r.region==='digital scale'?7:12)))throw Error('Unintended material coverage gap');
// Rive animates 24 cropped textures instead of retessellating thousands of paths.
mkdirSync('art/rive/hero/layers',{recursive:true});
const mask2x=await sharp(mask,{raw:{width:info.width,height:info.height,channels:4}}).resize(1400,1876).png().toBuffer();
// Extract the photograph's own fine wire highlights at export resolution.
// This is baked once, not an edge filter or pixel scan run in the browser.
const source2x=await sharp('src/assets/images/hero-statue-1400.webp').resize(1400,1876).ensureAlpha().raw().toBuffer();
const soft2x=await sharp(source2x,{raw:{width:1400,height:1876,channels:4}}).blur(2).raw().toBuffer();
const material2x=await sharp(mask2x).ensureAlpha().raw().toBuffer();
const wireStrength=new Float32Array(1400*1876);
const wirePhase=new Float32Array(1400*1876);
for(let y=0;y<1876;y++)for(let x=0;x<1400;x++){
  const q=y*1400+x,p=q*4;
  if(!material2x[p+3])continue;
  const luminance=source2x[p+1]*.6+source2x[p+2]*.4;
  const local=soft2x[p+1]*.6+soft2x[p+2]*.4;
  wireStrength[q]=Math.min(1,1.4*Math.pow(Math.min(1,Math.max(0,(luminance-local-1)/18)),.55))*material2x[p+3]/255;
  // Smooth overlapping fields light existing lines in independently moving
  // neighbourhoods, without stamping square tiles or inventing a new grid.
  wirePhase[q]=(12+5*Math.sin(x/47+y/89)+5*Math.sin(y/61-x/113))%24;
}
const wireColour=ULTRAMARINE_COLORS.accentBright.split(',').map(Number);
const svgPath=points=>`M${points.map(([x,y])=>`${x.toFixed(2)},${y.toFixed(2)}`).join(' L')}`;
let content='',timeline='',assets='';
async function texture(name,paths,rest=false,customSvg=null,wireGroup=null){
  const strokes=paths.map(p=>`${svgPath(p)} Z`).join(' ');
  const edges=paths.map(p=>svgPath(p.slice(0,3))).join(' ');
  const svg=customSvg??`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1876" viewBox="0 0 700 938"><defs><filter id="b" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.1"/></filter></defs>
  ${rest?'':`<path d="${strokes}" fill="${glow}" fill-opacity=".85" filter="url(#b)"/>`}
  <path d="${strokes}" fill="${light}" fill-opacity="${rest?.08:.64}" stroke="${glow}" stroke-opacity="${rest?.15:.65}" stroke-width=".4"/>
  <path d="${edges}" fill="none" stroke="${core}" stroke-opacity="${rest?.14:1}" stroke-width="${rest?.35:1.05}" stroke-linejoin="round"/>
  </svg>`;
  // Only explicitly authored exterior fragments bypass the material mask.
  // Body textures always retain the original mask and its transparent holes.
  const {data:rgba,info:ri}=await sharp(Buffer.from(svg)).composite(customSvg?[]:[{input:mask2x,blend:'dest-in'}]).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(!customSvg){
    for(let y=0;y<ri.height;y++)for(let x=0;x<ri.width;x++){
      // Keep the leg's filled, softly blooming fragments as the visual language.
      // Fine artwork traces support that material rather than replacing it with
      // a faint outline-only treatment. The approved leg remains untouched.
      if(y>=1020&&y<1650&&x<710)continue;
      const q=y*ri.width+x,p=q*4;
      const weight=rest?.1:Math.max(0,1-Math.abs(wirePhase[q]-wireGroup));
      const fragmentAlpha=rgba[p+3]/255;
      const traceAlpha=wireStrength[q]*weight*.65;
      if(fragmentAlpha===0){
        rgba[p]=wireColour[0];rgba[p+1]=wireColour[1];rgba[p+2]=wireColour[2];
      }
      rgba[p+3]=Math.round(255*(1-(1-fragmentAlpha)*(1-traceAlpha)));
    }
  }
  let left=ri.width,top=ri.height,right=0,bottom=0;
  for(let y=0;y<ri.height;y++)for(let x=0;x<ri.width;x++)if(rgba[(y*ri.width+x)*4+3]>0){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(right<left)return '';
  const file=`layers/${name}.png`,asset=id();
  const png=await sharp(rgba,{raw:{width:ri.width,height:ri.height,channels:4}}).extract({left,top,width:right-left+1,height:bottom-top+1}).png().toBuffer();
  // The Windows preview watcher can briefly hold a texture open while reloading.
  for(let attempt=0;;attempt++){
    try { writeFileSync(`art/rive/hero/${file}`,png);break; }
    catch(error){
      if(attempt>=5||!['UNKNOWN','EBUSY','EPERM'].includes(error.code))throw error;
      await new Promise(resolve=>setTimeout(resolve,100*(attempt+1)));
    }
  }
  assets+=`<ImageAsset id="${asset}" name="${name}" file="${file}"/>`;
  return `<Image assetId="${asset}" x="${left/2}" y="${top/2}" originX="0" originY="0" scaleX="0.5" scaleY="0.5"/>`;
}
for(let i=0;i<groups.length;i++){
  const group=groups[i],node=id();
  content+=`<Node id="${node}" name="Artwork light ${i}">${await texture('circuit-'+i,group.paths,false,null,i)}</Node>`;
  // Gentle overlapping harmonics have no target-arrival pauses, clamps, or
  // sudden brightness reversals. Independent phases avoid synchronized flashes.
  // A stable light floor preserves the material instead of blinking facets.
  const phase=random()*Math.PI*2,secondaryPhase=random()*Math.PI*2;
  const speed=8+i%3;
  const frames=Array.from({length:289},(_,k)=>{
    const t=k/288*Math.PI*2;
    const opacity=.56+.34*Math.sin(t*speed+phase)+.09*Math.sin(t*(speed+1)+secondaryPhase);
    return `<KeyFrameDouble frame="${k*5}" value="${opacity.toFixed(5)}" interpolationType="linear"/>`;
  }).join('');
  timeline+=`<KeyedObject objectId="${node}"><KeyedProperty propertyKey="18">${frames}</KeyedProperty></KeyedObject>`;
}
content+=await texture('rest',facets,true);
// Sparse material fragments collect toward the digital silhouette. Derive their
// destinations from the image, and reject trajectories crossing opaque pixels.
const manifest=[];
const clear=(x,y)=>x>=3&&x<info.width-3&&y>=3&&y<info.height-3&&
  [-2,0,2].every(dx=>[-2,0,2].every(dy=>data[(Math.round(y+dy)*info.width+Math.round(x+dx))*4+3]<12));
for(let y=65;y<930;y+=18){
  for(let x=95;x<345;x+=6){
    if(!clear(x,y)||manifest.some(p=>Math.hypot(p.x-x,p.y-y)<24))continue;
    const near=[8,12,18,24,30].find(dx=>allowed(x+dx,y));
    if(!near)continue;
    const dx=-12-random()*12,dy=-8+random()*16;
    if(!Array.from({length:10},(_,k)=>clear(x+dx*k/9,y+dy*k/9)).every(Boolean))continue;
    manifest.push({x,y,dx,dy});
    break;
  }
  if(manifest.length===28)break;
}
for(const [i,{x,y,dx,dy}] of manifest.entries()){
  const node=id(),s=1.5+(i%3)*.45;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1876" viewBox="0 0 700 938"><path d="M${x-s},${y-s} L${x+s},${y-s*.6} L${x+s*.7},${y+s} L${x-s},${y+s*.5}Z" fill="${light}" fill-opacity=".38" stroke="${core}" stroke-width=".55"/><path d="M${x-s},${y-s} L${x},${y} L${x+s*.7},${y+s}" stroke="${glow}" stroke-width=".4" fill="none"/></svg>`;
  content+=`<Node id="${node}" name="Manifest fragment ${i}">${await texture(`manifest-${i}`,[],false,svg)}</Node>`;
  const channels={13:t=>dx*(1-t),14:t=>dy*(1-t),18:t=>.65*Math.pow(Math.sin(Math.PI*t),2)};
  const tracks=Object.entries(channels).map(([key,value])=>`<KeyedProperty propertyKey="${key}">${Array.from({length:289},(_,k)=>{
    const progress=(k/288*(5+i%2)+i*.137)%1;
    return `<KeyFrameDouble frame="${k*5}" value="${value(progress).toFixed(5)}" interpolationType="linear"/>`;
  }).join('')}</KeyedProperty>`).join('');
  timeline+=`<KeyedObject objectId="${node}">${tracks}</KeyedObject>`;
}
const fire=await buildFire(id);
content+=fire.content;
assets+=fire.assets;
timeline+=fire.timeline;
const xml=`<Rive version="1" kind="fragment"><Artboard id="0:1" name="Mesh" width="700" height="938" styleId="0:2" defaultStateMachineId="0:4"><LayoutComponentStyle id="0:2"/>${content}<LinearAnimation id="0:3" name="Ambient" duration="1440" fps="60" loopValue="loop">${timeline}</LinearAnimation><StateMachine id="0:4" name="Ambient"><StateMachineLayer><EntryState><StateTransition stateToId="0:5"/></EntryState><AnimationState id="0:5" animationId="0:3" x="200"/></StateMachineLayer></StateMachine></Artboard>${assets}</Rive>`;
writeFileSync('art/rive/hero/scene.rml',xml);
console.log(`${facets.length} organically clustered facets, ${manifest.length} exterior squares, 24 lighting groups + two blended fire sequences`);
execFileSync('rive',['art/rive/hero','--verify'],{stdio:'inherit'});
execFileSync('rive',['inspect','art/rive/hero','--summary'],{stdio:'inherit'});
execFileSync('rive',['art/rive/hero','--once'],{stdio:'inherit'});
copyFileSync('art/rive/hero/build/hero.riv','public/animations/hero.riv');
