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
const mask=Buffer.alloc(info.width*info.height*4);
for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++){
  const p=(y*info.width+x)*4;
  const r=data[p],g=data[p+1],b=data[p+2];
  const blue=Math.min(1,Math.max(0,(b-r-22)/25))*Math.min(1,Math.max(0,(g-r-10)/18));
  const body=x<355 ? blue:0;
  const pan=x>466&&x<564&&y>230&&y<405 ? 0.95:0;
  mask[p]=mask[p+1]=mask[p+2]=255;
  mask[p+3]=Math.round(data[p+3]*Math.max(body,pan));
}
await sharp(mask,{raw:{width:info.width,height:info.height,channels:4}}).png().toFile('public/animations/statue-digital-mask.png');
const allowed=(x,y)=>{
  x=Math.round(x);y=Math.round(y);
  return x>=0&&x<info.width&&y>=0&&y<info.height&&mask[(y*info.width+x)*4+3]>45;
};
const candidates=[];
// Anatomical guide ribbons, in the photograph's 700px coordinate space.
// Each lane follows the guide's tangent; its light phase follows distance along
// that guide, not screen Y. The original material alpha still clips every lane.
function ribbon(guide,width,lanes,start=0,end=1){
  const lengths=guide.slice(1).map((p,i)=>Math.hypot(p[0]-guide[i][0],p[1]-guide[i][1]));
  const total=lengths.reduce((a,b)=>a+b,0);
  const point=(distance,offset)=>{
    let index=0;
    while(index<lengths.length-1&&distance>lengths[index])distance-=lengths[index++];
    const a=guide[index],b=guide[index+1],t=Math.min(1,distance/lengths[index]);
    const dx=(b[0]-a[0])/lengths[index],dy=(b[1]-a[1])/lengths[index];
    return [a[0]+(b[0]-a[0])*t-dy*offset,a[1]+(b[1]-a[1])*t+dx*offset];
  };
  for(let lane=0;lane<lanes;lane++){
    let offset=(lane/(lanes-1)-.5)*width+(random()-.5)*3;
    for(let distance=random()*22;distance<total;){
      const run=35+random()*65,finish=Math.min(total,distance+run);
      const bend=(random()>.5?1:-1)*(3+random()*5);
      const nextOffset=Math.max(-width*.55,Math.min(width*.55,offset+bend));
      const progress=start+(end-start)*distance/total;
      const turn=.25+random()*.45;
      const points=[point(distance,offset),point(distance+(finish-distance)*turn,offset),point(distance+(finish-distance)*Math.min(.94,turn+.2),nextOffset),point(finish,nextOffset)];
      const cohort=lane%2;
      if(points.some(p=>allowed(...p))){
        candidates.push({points,progress,cohort});
        // Occasional short forks and open terminals, not a repeated ladder.
        if(random()>.9){
          const branch=[points[1],point(distance+run*turn+4,offset+(random()>.5?1:-1)*(3+random()*5))];
          candidates.push({points:branch,progress,cohort});
        }
      }
      offset=nextOffset;
      distance=finish+8+random()*18;
    }
  }
}
// Plinth → foot → knee → hip → chest → neck → head.
ribbon([[224,937],[224,883],[250,853],[292,829],[294,742],[276,643],[274,543],[267,430],[280,340],[300,268],[304,203],[322,149],[319,69]],64,12);
// Shoulder → forearm → wrist → hilt → blade tip: downward, unlike the torso.
ribbon([[264,215],[225,297],[205,370],[181,440],[169,493]],32,7,0,.5);
ribbon([[169,483],[179,520],[208,601],[237,676],[264,752]],22,5,.5,1);
// Chest mesh follows the diagonal fold instead of cutting straight through it.
ribbon([[273,344],[296,314],[320,299],[304,268],[286,239]],28,5,.7,.88);
// Digital scale: down each chain, then over the curved bowl. No brass pan.
for(const side of [-1,0,1])ribbon([[512,244],[513+side*18,306],[513+side*39,377]],3,2,0,.78);
for(let lane=0;lane<6;lane++){
  const x=475+lane*15.2;
  ribbon([[x,377],[514+(x-514)*.91,385],[514+(x-514)*.58,394],[514+(x-514)*.18,398]],2,2,.78,1);
}
ribbon([[474,378],[488,381],[514,382],[540,381],[554,378]],2,2,.77,.9);
const groups=Array.from({length:24},()=>({paths:[],dots:[]}));
const facets=[];
const occupied=new Set();
for(const {points} of candidates){
  // Use the anatomical guides only to distribute light: no lines are drawn.
  for(let segment=1;segment<points.length;segment++){
    const a=points[segment-1],b=points[segment];
    const length=Math.hypot(b[0]-a[0],b[1]-a[1]);
    for(let d=0;d<length;d+=5+random()*7){
      const x=a[0]+(b[0]-a[0])*d/length,y=a[1]+(b[1]-a[1])*d/length;
      const cell=`${Math.floor(x/6)}:${Math.floor(y/6)}`;
      if(!allowed(x,y)||occupied.has(cell))continue;
      occupied.add(cell);
      const size=1.7+random()*3.4,skew=(random()-.5)*size;
      const facet=[[x-size,y-size*.65],[x+size*.7,y-size*.65+skew],[x+size,y+size*.65],[x-size*.8,y+size*.65-skew]];
      facets.push(facet);
      groups[Math.floor(random()*groups.length)].paths.push(facet);
    }
  }
}
// Bake immutable fine geometry and its material mask once at build time.
// Rive animates 24 cropped textures instead of retessellating thousands of paths.
mkdirSync('art/rive/hero/layers',{recursive:true});
const mask2x=await sharp(mask,{raw:{width:info.width,height:info.height,channels:4}}).resize(1400,1876).png().toBuffer();
const svgPath=points=>`M${points.map(([x,y])=>`${x.toFixed(2)},${y.toFixed(2)}`).join(' L')}`;
let content='',timeline='',assets='';
async function texture(name,paths,rest=false,customSvg=null){
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
  let left=ri.width,top=ri.height,right=0,bottom=0;
  for(let y=0;y<ri.height;y++)for(let x=0;x<ri.width;x++)if(rgba[(y*ri.width+x)*4+3]>0){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(right<left)return '';
  const file=`layers/${name}.png`,asset=id();
  await sharp(rgba,{raw:{width:ri.width,height:ri.height,channels:4}}).extract({left,top,width:right-left+1,height:bottom-top+1}).png().toFile(`art/rive/hero/${file}`);
  assets+=`<ImageAsset id="${asset}" name="${name}" file="${file}"/>`;
  return `<Image assetId="${asset}" x="${left/2}" y="${top/2}" originX="0" originY="0" scaleX="0.5" scaleY="0.5"/>`;
}
for(let i=0;i<groups.length;i++){
  const group=groups[i],node=id();
  content+=`<Node id="${node}" name="Fragment light ${i}">${await texture('circuit-'+i,group.paths)}</Node>`;
  // Gentle overlapping harmonics have no target-arrival pauses, clamps, or
  // sudden brightness reversals. Independent phases avoid synchronized flashes.
  // A stable light floor preserves the material instead of blinking facets.
  const phase=random()*Math.PI*2,secondaryPhase=random()*Math.PI*2;
  const speed=5+i%3;
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
for(let y=90;y<920;y+=28){
  for(let x=120;x<345;x+=6){
    if(!clear(x,y)||manifest.some(p=>Math.hypot(p.x-x,p.y-y)<48))continue;
    const near=[8,12,18].find(dx=>allowed(x+dx,y));
    if(!near)continue;
    const dx=-12-random()*12,dy=-8+random()*16;
    if(!Array.from({length:10},(_,k)=>clear(x+dx*k/9,y+dy*k/9)).every(Boolean))continue;
    manifest.push({x,y,dx,dy});
    break;
  }
  if(manifest.length===12)break;
}
for(const [i,{x,y,dx,dy}] of manifest.entries()){
  const node=id(),s=1.3+(i%3)*.4;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1876" viewBox="0 0 700 938"><path d="M${x-s},${y-s} L${x+s},${y-s*.6} L${x+s*.7},${y+s} L${x-s},${y+s*.5}Z" fill="${light}" fill-opacity=".38" stroke="${core}" stroke-width=".55"/><path d="M${x-s},${y-s} L${x},${y} L${x+s*.7},${y+s}" stroke="${glow}" stroke-width=".4" fill="none"/></svg>`;
  content+=`<Node id="${node}" name="Manifest fragment ${i}">${await texture(`manifest-${i}`,[],false,svg)}</Node>`;
  const channels={13:t=>dx*(1-t),14:t=>dy*(1-t),18:t=>.65*Math.pow(Math.sin(Math.PI*t),2)};
  const tracks=Object.entries(channels).map(([key,value])=>`<KeyedProperty propertyKey="${key}">${Array.from({length:289},(_,k)=>{
    const progress=(k/288*(3+i%2)+i*.137)%1;
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
console.log(`${facets.length} illuminated facets, 24 lighting groups + two blended fire sequences`);
execFileSync('rive',['art/rive/hero','--verify'],{stdio:'inherit'});
execFileSync('rive',['inspect','art/rive/hero','--summary'],{stdio:'inherit'});
execFileSync('rive',['art/rive/hero','--once'],{stdio:'inherit'});
copyFileSync('art/rive/hero/build/hero.riv','public/animations/hero.riv');
