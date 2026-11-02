import { animate } from './assets/vendor/motion.js';

const root = document.querySelector('.hero-story');
const canvas = document.querySelector('#protein-canvas');
const context = canvas.getContext('2d');
const buttons = [...root.querySelectorAll('[data-scene-step]')];
const playButton = root.querySelector('#scene-play');
const description = root.querySelector('.scene-description');
const labels = [...root.querySelectorAll('.protein-labels span')];
const osReduced = matchMedia('(prefers-reduced-motion: reduce)');
const descriptions = [
  'DNA-encoded libraries link candidate molecules to their DNA barcodes.',
  'A molecular glue recruits the target to an E3 ubiquitin ligase.',
  'The E3 ligase helps build a ubiquitin chain on the target.',
  'The proteasome unfolds the tagged target and cleaves it into short peptides.'
];
const clamp = v => Math.max(0,Math.min(1,v));
const smooth = (a,b,v) => {const n=clamp((v-a)/(b-a));return n*n*(3-2*n);};
let control, progress=0.47, ready=false, visible=true, userPaused=false, finished=false, currentPhase=-1;
let targetImage, effectorImage, glueImage, proteasomeImage;
let currentDetail = -1;
const ubiquitinSites=[[373,180],[402,143],[435,111],[473,88]];
const allowsMotion = () => !osReduced.matches && !document.documentElement.classList.contains('no-motion');

function loadImage(path) {
  return new Promise((resolve,reject)=>{
    const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;
    image.src=new URL(path,import.meta.url).href;
  });
}
function drawAsset(image,cx,cy,size,rotation=0,alpha=1) {
  context.save();context.translate(cx,cy);context.rotate(rotation);context.globalAlpha=alpha;
  context.drawImage(image,-size/2,-size*image.height/image.width/2,size,size*image.height/image.width);
  context.restore();
}
function dnaTag(x,y,length,alpha,rotation=0) {
  context.save();context.translate(x,y);context.rotate(rotation);context.globalAlpha=alpha;
  context.lineCap='round';
  const depth=15;
  for(let i=0;i<length;i+=8) {
    const t=i/length*Math.PI*6;
    const y1=Math.sin(t)*depth,y2=-y1;
    context.strokeStyle=['#517824','#91b846','#709f2d','#c1f65b'][Math.floor(i/8)%4];
    context.lineWidth=3;context.beginPath();context.moveTo(i,y1);context.lineTo(i,y2);context.stroke();
  }
  for(const side of [-1,1]) {
    const gradient=context.createLinearGradient(0,-depth,0,depth);
    gradient.addColorStop(0,'#d7ff8f');gradient.addColorStop(.45,'#a0d74e');gradient.addColorStop(1,'#517824');
    context.strokeStyle=gradient;context.lineWidth=5;context.beginPath();
    for(let i=0;i<=length;i+=2) {
      const dy=Math.sin(i/length*Math.PI*6)*depth*side;
      if(i===0)context.moveTo(i,dy);else context.lineTo(i,dy);
    }
    context.stroke();
  }
  context.restore();
}
function drawLibrary(alpha) {
  if(alpha<=0)return;
  context.save();context.globalAlpha=alpha;context.strokeStyle='#709f2d';context.lineWidth=2;
  context.beginPath();context.moveTo(505,302);context.bezierCurveTo(520,360,458,373,458,405);context.stroke();
  context.restore();
  dnaTag(458,405,96,alpha,.08);
  drawAsset(glueImage,501,142,82,-.1,alpha*.65);
  context.save();context.globalAlpha=alpha*.65;context.strokeStyle='#709f2d';context.lineWidth=1.8;
  context.beginPath();context.moveTo(502,163);context.lineTo(504,190);context.stroke();context.restore();
  dnaTag(463,196,80,alpha*.65);
}
function drawUbiquitinChain(p,dx,dy) {
  const release=smooth(.77,.89,p);
  const opacity=1-smooth(.91,.98,p);
  if(p<.50||opacity<=0)return;
  const shiftX=Math.min(dx,6)-release*55,shiftY=Math.max(dy,-34)-release*12;
  context.save();context.translate(shiftX,shiftY);context.globalAlpha=opacity;
  const sites=ubiquitinSites;
  let x=350,y=212;
  for(let i=0;i<sites.length;i++) {
    const a=smooth(.50+i*.027,.53+i*.027,p);
    if(a<=0)break;
    const nx=sites[i][0],ny=sites[i][1];
    context.save();context.globalAlpha=opacity*a;
    context.strokeStyle='#b2a487';context.lineWidth=3.5;context.lineCap='round';
    context.beginPath();context.moveTo(x,y);context.quadraticCurveTo(nx-12,y,nx,ny);context.stroke();
    drawAsset(targetImage,nx,ny,52,i*.65,a*opacity);
    context.restore();x=nx;y=ny;
  }
  context.restore();
}
function drawPolypeptide(p) {
  const feed=smooth(.75,.97,p),appear=smooth(.72,.79,p);
  if(appear<=0||feed>=1)return;
  context.save();context.globalAlpha=appear*(1-smooth(.94,1,p));context.lineCap='round';context.lineJoin='round';
  const start=feed*.5;
  for(let pass=0;pass<2;pass++) {
    context.strokeStyle=pass===0?'#b7a78a':'#ece3d2';context.lineWidth=pass===0?12:7;
    context.beginPath();
    for(let i=0;i<=110;i++) {
      const t=start+(1-start)*i/110;
      const envelope=Math.sin(Math.PI*t);
      const x=310+105*t+Math.sin(t*Math.PI*5-feed*5)*31*envelope;
      const y=202+151*t+Math.cos(t*Math.PI*4-feed*5)*17*envelope;
      if(i===0)context.moveTo(x,y);else context.lineTo(x,y);
    }
    context.stroke();
  }
  context.restore();
}
function drawPeptides(p) {
  if(p<.84)return;
  context.save();context.lineCap='round';
  for(let i=0;i<7;i++) {
    const q=smooth(.84+i*.012,.96+i*.006,p);
    if(q<=0)continue;
    const x=157-q*(72+(i%3)*15),y=359+q*(46+(i%4)*22);
    context.globalAlpha=smooth(.84+i*.012,.86+i*.012,p)*(1-q*.25);
    for(let pass=0;pass<2;pass++) {
      context.strokeStyle=pass===0?'#b7a78a':'#eee4d2';context.lineWidth=pass===0?6:3;
      context.beginPath();context.moveTo(x-13,y-3);context.bezierCurveTo(x-5,y-14,x+4,y+12,x+17,y+1);context.stroke();
    }
  }
  context.restore();
}
function updateLabels(phase,p) {
  const targetLabel=phase===3?'26S proteasome':phase===2?'Ub-tagged target':'Target protein';
  const glueLabel=phase===0?'DNA-encoded library':'Molecular glue';
  if(labels[0].textContent!==targetLabel)labels[0].textContent=targetLabel;
  if(labels[1].textContent!==glueLabel)labels[1].textContent=glueLabel;
  if(labels[2].textContent!=='E3 ligase')labels[2].textContent='E3 ligase';
  if(phase!==currentPhase) {
    currentPhase=phase;root.dataset.phase=String(phase);
    for(const button of buttons)button.setAttribute('aria-pressed',String(Number(button.dataset.sceneStep)===phase));
  }
  const detail=p<.70?phase:p<.79?4:p<.91?5:6;
  if(detail===currentDetail)return;
  currentDetail=detail;
  const detailCopy=[...descriptions,
    'The ubiquitin-tagged target is recognized by the proteasome.',
    'Ubiquitin is removed as the target unfolds and enters the proteasome.',
    'The target is cleaved into short peptides. The E3 ligase remains.'
  ];
  description.textContent=detailCopy[detail];
}
function render(p=progress) {
  if(!ready)return;
  progress=p;
  context.setTransform(canvas.width/1000,0,0,canvas.height/600,0,0);context.clearRect(0,0,1000,600);
  const join=smooth(.18,.42,p),unfold=smooth(.71,.89,p),release=smooth(.68,.78,p);
  const targetX=220+join*73+unfold*17,targetY=300-unfold*98;
  const effectorX=780-join*62;
  context.save();context.beginPath();context.rect(0,0,1000,540);context.clip();
  drawLibrary(1-smooth(.19,.33,p));
  drawAsset(glueImage,503+release*71,300-release*12,125+join*140-release*85,-.08+join*.08,1);
  drawAsset(targetImage,targetX,targetY,450-unfold*235,unfold*-.12,1-smooth(.78,.93,p));
  drawAsset(effectorImage,effectorX,300,450);
  drawUbiquitinChain(p,targetX-293,targetY-300);
  if(p>.70)drawAsset(proteasomeImage,280,354,320,0,smooth(.70,.79,p));
  drawPolypeptide(p);
  drawPeptides(p);
  context.restore();
  updateLabels(p<.28?0:p<.50?1:p<.70?2:3,p);
}
function updatePlayLabel() {
  playButton.innerHTML=finished?'Replay animation <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7a6 6 0 1 1 0 6M4 3v4h4"/></svg>':userPaused||control?.state==='paused'?'Play animation <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 8 6-8 6Z"/></svg>':'Pause animation <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10m6-10v10"/></svg>';
}
function stop(){control?.stop();control=undefined;}
function play() {
  if(!ready||!allowsMotion())return;
  stop();if(finished){progress=0;finished=false;}
  userPaused=false;
  control=animate(progress,1,{duration:(1-progress)*18,ease:'linear',onUpdate:render,onComplete:()=>{finished=true;updatePlayLabel();}});
  updatePlayLabel();syncVisibility();
}
function moveTo(step) {
  if(!ready)return;
  stop();userPaused=true;finished=false;
  const to=[0,.44,.65,.88][step];
  if(!allowsMotion())render(to);
  else control=animate(progress,to,{duration:.9,ease:[.16,1,.3,1],onUpdate:render});
  updatePlayLabel();
}
function resize() {
  const rect=canvas.getBoundingClientRect();const width=rect.width,height=rect.height;
  const ratio=Math.min(devicePixelRatio,2);
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);render();
}
function syncPreference() {
  if(!ready)return;
  if(!allowsMotion()){stop();userPaused=true;finished=false;render(.48);}
  playButton.hidden=!allowsMotion();updatePlayLabel();
}
function syncVisibility() {
  if(!ready||userPaused||finished)return;
  if(!visible||document.hidden)control?.pause();
  else if(control?.state==='paused')control.play();
}
for(const button of buttons)button.addEventListener('click',()=>moveTo(Number(button.dataset.sceneStep)));
playButton.addEventListener('click',()=>{
  if(!allowsMotion())return;
  if(!finished&&!userPaused&&control?.state!=='paused'){control?.pause();userPaused=true;updatePlayLabel();}
  else if(userPaused&&control?.state==='paused'){userPaused=false;control.play();updatePlayLabel();syncVisibility();}
  else play();
});
window.addEventListener('gluetec:motion',syncPreference);osReduced.addEventListener('change',syncPreference);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncVisibility();},{threshold:.1}).observe(root);
document.addEventListener('visibilitychange',syncVisibility);
async function init() {
  try {
    [targetImage,effectorImage,glueImage,proteasomeImage]=await Promise.all([
      loadImage('./assets/protein-target.webp'),loadImage('./assets/protein-effector.webp'),loadImage('./assets/molecular-glue.webp'),loadImage('./assets/proteasome.webp')
    ]);
    ready=true;root.dataset.render='sculpture';root.classList.add('scene-ready');
    new ResizeObserver(resize).observe(canvas.parentElement);resize();
    render(allowsMotion()?0:.48);playButton.hidden=!allowsMotion();
    if(allowsMotion())play();else{userPaused=true;updatePlayLabel();}
  } catch {
    root.dataset.render='fallback';root.querySelector('.hero-sequence').hidden=true;
    description.textContent='A molecular glue brings two proteins together.';
  }
}
init();
