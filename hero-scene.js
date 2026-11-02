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
  'A molecular glue brings the target and effector together.',
  'The target breaks down. The effector remains.'
];
const clamp = v => Math.max(0,Math.min(1,v));
const smooth = (a,b,v) => {const n=clamp((v-a)/(b-a));return n*n*(3-2*n);};
let control, progress=0.47, ready=false, visible=true, userPaused=false, finished=false, currentPhase=-1;
let targetImage, effectorImage, glueImage;
const tiles=[];
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
function drawFragments(cx,cy,size,p) {
  const unit=size/targetImage.width;
  for(const tile of tiles) {
    const amount=smooth(.65+tile.delay,.98,p);
    const opacity=1-smooth(.38,1,amount);
    if(opacity<.005)continue;
    context.save();context.globalAlpha=opacity;
    context.translate(cx+(tile.x+tile.w/2-targetImage.width/2)*unit+tile.dx*amount,
      cy+(tile.y+tile.h/2-targetImage.height/2)*unit+tile.dy*amount);
    context.rotate(tile.rotation*amount);
    const scale=1-amount*.66;context.scale(scale,scale);
    context.drawImage(targetImage,tile.x,tile.y,tile.w,tile.h,-tile.w*unit/2,-tile.h*unit/2,tile.w*unit,tile.h*unit);
    context.restore();
  }
}
function updateLabels(phase,p) {
  const targetLabel=p>.97?'Target degraded':phase===2?'Target fragments':'Target protein';
  const glueLabel=phase===0?'DNA-encoded library':'Molecular glue';
  if(labels[0].textContent!==targetLabel)labels[0].textContent=targetLabel;
  if(labels[1].textContent!==glueLabel)labels[1].textContent=glueLabel;
  if(phase===currentPhase)return;
  currentPhase=phase;root.dataset.phase=String(phase);
  for(const button of buttons)button.setAttribute('aria-pressed',String(Number(button.dataset.sceneStep)===phase));
  description.textContent=descriptions[phase];
}
function render(p=progress) {
  if(!ready)return;
  progress=p;
  context.setTransform(canvas.width/1000,0,0,canvas.height/600,0,0);context.clearRect(0,0,1000,600);
  const join=smooth(.2,.43,p);
  const targetX=220+join*73,effectorX=780-join*62;
  const proteinSize=450,proteinY=300;
  context.save();context.beginPath();context.rect(0,0,1000,540);context.clip();
  const library=1-smooth(.19,.35,p);
  drawLibrary(library);
  drawAsset(glueImage,503,300,125+join*140,-.08+join*.08,1);
  if(p<=.65)drawAsset(targetImage,targetX,proteinY,proteinSize);
  else drawFragments(targetX,proteinY,proteinSize,p);
  drawAsset(effectorImage,effectorX,proteinY,proteinSize);
  context.restore();
  updateLabels(p<.29?0:p<.65?1:2,p);
}
function updatePlayLabel() {
  playButton.innerHTML=finished?'Replay animation <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7a6 6 0 1 1 0 6M4 3v4h4"/></svg>':userPaused||control?.state==='paused'?'Play animation <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 8 6-8 6Z"/></svg>':'Pause animation <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10m6-10v10"/></svg>';
}
function stop(){control?.stop();control=undefined;}
function play() {
  if(!ready||!allowsMotion())return;
  stop();if(finished){progress=0;finished=false;}
  userPaused=false;
  control=animate(progress,1,{duration:(1-progress)*14,ease:'linear',onUpdate:render,onComplete:()=>{finished=true;updatePlayLabel();}});
  updatePlayLabel();syncVisibility();
}
function moveTo(step) {
  if(!ready)return;
  stop();userPaused=true;finished=false;
  const to=[0,.48,.82][step];
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
    [targetImage,effectorImage,glueImage]=await Promise.all([
      loadImage('./assets/protein-target.webp'),loadImage('./assets/protein-effector.webp'),loadImage('./assets/molecular-glue.webp')
    ]);
    const columns=14,rows=18;
    for(let y=0;y<rows;y++)for(let x=0;x<columns;x++) {
      const i=y*columns+x;
      tiles.push({x:x*targetImage.width/columns,y:y*targetImage.height/rows,w:targetImage.width/columns,h:targetImage.height/rows,
        delay:(i%7)*.007,dx:Math.sin(i*2.4)*110-30,dy:50+(i%9)*23,rotation:Math.sin(i*1.7)*1.5});
    }
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
