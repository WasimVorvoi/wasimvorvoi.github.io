(function(){
'use strict';

const init = document.createElement('div');
init.className='fx-init';
init.innerHTML = `
  <div class="globe"><span class="core"></span></div>
  <div class="lines">
    <div>The <em>remote</em> index</div>
    <div>SYNCING 142 CITIES · 38 TIME ZONES</div>
  </div>
`;
document.body.appendChild(init);
setTimeout(()=>{
  init.classList.add('gone');
  setTimeout(()=>init.remove(), 700);
  document.querySelector('.hero h1')?.classList.add('go');
}, 1200);

const stars = document.createElement('canvas');
stars.className='fx-stars';
document.body.appendChild(stars);
const sx = stars.getContext('2d');
let W=0,H=0,dots=[];
function resize(){ W=stars.width=innerWidth*devicePixelRatio; H=stars.height=innerHeight*devicePixelRatio; stars.style.width=innerWidth+'px'; stars.style.height=innerHeight+'px'; }
resize(); addEventListener('resize',resize);
const N = 90;
for(let i=0;i<N;i++){
  dots.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.2+.4});
}
let mx=innerWidth/2,my=innerHeight/2;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
function drawStars(){
  sx.clearRect(0,0,W,H);
  sx.save();
  sx.scale(devicePixelRatio,devicePixelRatio);
  for(let i=0;i<dots.length;i++){
    const d = dots[i];
    d.x += d.vx; d.y += d.vy;
    if(d.x<0) d.x = innerWidth; if(d.x>innerWidth) d.x = 0;
    if(d.y<0) d.y = innerHeight; if(d.y>innerHeight) d.y = 0;
    sx.beginPath();
    sx.fillStyle = `rgba(125,211,192,${.3+d.r*.3})`;
    sx.arc(d.x,d.y,d.r,0,Math.PI*2);
    sx.fill();
  }

  for(let i=0;i<dots.length;i++){
    const d = dots[i];
    const dx = d.x-mx, dy = d.y-my;
    const dist = Math.hypot(dx,dy);
    if(dist<180){
      sx.beginPath();
      sx.strokeStyle = `rgba(244,238,228,${.15*(1-dist/180)})`;
      sx.lineWidth = .8;
      sx.moveTo(mx,my); sx.lineTo(d.x,d.y);
      sx.stroke();
    }
  }
  sx.restore();
  requestAnimationFrame(drawStars);
}
drawStars();

const isHover = matchMedia('(hover:hover)').matches;
let cur, glow;
if(isHover){
  cur = document.createElement('div'); cur.className='fx-cur';
  glow = document.createElement('div'); glow.className='fx-glow';
  document.body.appendChild(cur); document.body.appendChild(glow);
  let tx=0,ty=0,cx=innerWidth/2,cy=innerHeight/2,gx=cx,gy=cy;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;});
  (function loop(){
    cx+=(tx-cx)*.4; cy+=(ty-cy)*.4;
    gx+=(tx-gx)*.06; gy+=(ty-gy)*.06;
    cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    glow.style.transform=`translate(${gx}px,${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  addEventListener('mouseover',e=>{
    const t = e.target.closest('a,button,select,input,.city-card,.visa-row,.itin-slot,.bf,.tz-add,.region-pill,.clim-mo,.compare-side,.tag,.qf');
    if(t) cur.classList.add('hot'); else cur.classList.remove('hot');
  });
}

const h1 = document.querySelector('.hero h1');
if(h1){

  const frag = document.createDocumentFragment();
  Array.from(h1.childNodes).forEach(node=>{
    if(node.nodeType===3){
      node.textContent.split(/(\s+)/).forEach(w=>{
        if(!w.trim()){ frag.appendChild(document.createTextNode(w)); return; }
        const outer = document.createElement('span'); outer.className='fx-word';
        const inner = document.createElement('span'); inner.textContent = w;
        outer.appendChild(inner); frag.appendChild(outer);
      });
    } else if(node.tagName==='BR'){
      frag.appendChild(document.createElement('br'));
    } else {
      const outer = document.createElement('span'); outer.className='fx-word';
      const inner = node.cloneNode(true);
      outer.appendChild(inner); frag.appendChild(outer);
    }
  });
  h1.innerHTML = ''; h1.appendChild(frag);
  h1.querySelectorAll('.fx-word > span').forEach((sp,i)=>{
    sp.style.transitionDelay = (1.0 + i*0.06)+'s';
  });
}

const kicker = document.querySelector('.hero-kicker');
if(kicker){
  const rotor = document.createElement('span');
  rotor.className='fx-rotor';
  rotor.style.width='10ch';
  rotor.innerHTML = `<span class="r-list" id="fx-rotor-list">
    <span>anywhere</span><span>over coffee</span><span>on a train</span><span>in tokyo</span><span>off-grid</span><span>anywhere</span>
  </span>`;

  const prev = kicker.innerHTML;
  if(!prev.includes('fx-rotor')){
    kicker.innerHTML = prev + ` · LIVE & WORK <span id="fx-rotor-host"></span>`;
    document.getElementById('fx-rotor-host').appendChild(rotor);
    const list = rotor.querySelector('.r-list');
    let idx = 0;
    const items = list.children;
    setInterval(()=>{
      idx = (idx+1) % (items.length-1);
      list.style.transform = `translateY(-${idx*1.4}em)`;
    }, 2400);
  }
}

const io = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{rootMargin:'-8% 0px -6% 0px'});
document.querySelectorAll('.sec, .hero, .ticker, .foot').forEach(el=>{ el.classList.add('fx-rv'); io.observe(el); });
document.querySelectorAll('.city-card, .bf, .visa-row, .itin-slot, .clim-mo, .cert').forEach(el=>{ el.classList.add('fx-rv-3d'); io.observe(el); });

function stagger(sel){
  const items = document.querySelectorAll(sel);
  items.forEach((el,i)=>{ el.style.transitionDelay = (i*0.06)+'s'; });
}
stagger('.cities .city-card');
stagger('.bestfor .bf');
stagger('.visa-row');
stagger('.clim-mo');
stagger('.itin-grid .itin-slot');

document.querySelectorAll('.city-card').forEach(c=>{
  const spot = document.createElement('div'); spot.className='spot'; c.appendChild(spot);
  c.addEventListener('mousemove',e=>{
    const r = c.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width;
    const py = (e.clientY-r.top)/r.height;
    c.style.transform = `perspective(900px) rotateX(${(0.5-py)*5}deg) rotateY(${(px-.5)*6}deg) translateY(-4px)`;
    c.style.setProperty('--mx',(px*100)+'%');
    c.style.setProperty('--my',(py*100)+'%');
  });
  c.addEventListener('mouseleave',()=>{ c.style.transform=''; });
});

document.querySelectorAll('.bf, .itin-slot, .compare-side').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r = c.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - .5;
    const py = (e.clientY-r.top)/r.height - .5;
    c.style.transform = `perspective(900px) rotateX(${-py*4}deg) rotateY(${px*5}deg) translateY(-2px)`;
  });
  c.addEventListener('mouseleave',()=>{ c.style.transform=''; });
});

function tickHeroClocks(){
  document.querySelectorAll('.hero-card-row .v').forEach(v=>{
    const tz = v.dataset.tz;
    if(!tz) return;
    try{
      const now = new Date();
      const opts = {hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz};
      v.textContent = new Intl.DateTimeFormat('en-GB',opts).format(now);
    }catch(e){}
  });
}

const cityTzMap = {
  'lisbon':'Europe/Lisbon','tokyo':'Asia/Tokyo','medellín':'America/Bogota','medellin':'America/Bogota',
  'mexico city':'America/Mexico_City','bali':'Asia/Makassar','chiang mai':'Asia/Bangkok','bangkok':'Asia/Bangkok',
  'berlin':'Europe/Berlin','barcelona':'Europe/Madrid','madrid':'Europe/Madrid','singapore':'Asia/Singapore',
  'taipei':'Asia/Taipei','seoul':'Asia/Seoul','dubai':'Asia/Dubai','london':'Europe/London','prague':'Europe/Prague',
  'buenos aires':'America/Argentina/Buenos_Aires','cape town':'Africa/Johannesburg','tbilisi':'Asia/Tbilisi'
};
document.querySelectorAll('.hero-card .hero-card-row').forEach(row=>{
  const nm = (row.querySelector('.nm')?.textContent || row.textContent).trim().toLowerCase();
  for(const key in cityTzMap){
    if(nm.includes(key)){
      const v = row.querySelector('.v');
      if(v){ v.dataset.tz = cityTzMap[key]; v.style.fontFamily="'Geist Mono',monospace"; }
      break;
    }
  }
});
tickHeroClocks(); setInterval(tickHeroClocks, 30000);

const budget = document.querySelector('.budget-slider input[type=range]');
const budgetAmt = document.querySelector('.budget-amount');
if(budget && budgetAmt){
  let em = budgetAmt.querySelector('em');
  if(!em){

    em = document.createElement('em');
    em.innerHTML = budgetAmt.innerHTML;
    budgetAmt.innerHTML = '';
    budgetAmt.appendChild(em);
  }
  const obs = new MutationObserver(()=>{ em.classList.remove('bump'); void em.offsetWidth; em.classList.add('bump'); });
  obs.observe(budgetAmt,{childList:true,characterData:true,subtree:true});
}

document.querySelectorAll('.hero-cta').forEach(b=>{
  b.addEventListener('mousemove',e=>{
    const r = b.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - .5;
    const py = (e.clientY-r.top)/r.height - .5;
    b.style.transform = `translate(${px*6}px,${py*4}px)`;
    b.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    b.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
  b.addEventListener('mouseleave',()=>{ b.style.transform=''; });
});

function animateInts(){
  document.querySelectorAll('.ticker-cell .v, .stat-num, .budget-stat .v, .compare-stat .v').forEach(el=>{
    if(el.dataset.done || !el.isConnected) return;

  });
}

})();
