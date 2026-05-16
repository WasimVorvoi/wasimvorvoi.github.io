(function(){
'use strict';

const boot = document.createElement('div');
boot.className = 'fx-boot';
boot.innerHTML = `
  <div class="b-static"></div>
  <div class="b-mark"></div>
  <div class="b-line" id="fxb-l1"><span>&gt;</span> CONNECTING TO ATLAS</div>
  <div class="b-line" id="fxb-l2"><span>&gt;</span> FETCH /comps · 412 NODES</div>
  <div class="b-line" id="fxb-l3"><span>&gt;</span> SIGNAL LOCK ESTABLISHED</div>
  <div class="b-bar"></div>
`;
document.body.appendChild(boot);

const lines = boot.querySelectorAll('.b-line');
lines.forEach(l=>{ l.style.opacity = '0'; l.style.transform = 'translateY(6px)'; l.style.transition='opacity .25s, transform .25s'; });
let t = 60;
lines.forEach((l,i)=>{
  setTimeout(()=>{ l.style.opacity='1'; l.style.transform='none'; }, t);
  t += 350;
});
setTimeout(()=>{
  boot.classList.add('gone');
  setTimeout(()=>boot.remove(), 600);
  document.body.classList.add('fx-ready');
  triggerHeroMount();
}, 1500);

let cur;
if (matchMedia('(hover:hover)').matches){
  cur = document.createElement('div');
  cur.className='fx-cur';
  cur.innerHTML=`
    <div class="ring"><div class="dot"></div></div>
    <div class="br tl"></div><div class="br tr"></div><div class="br bl"></div><div class="br br"></div>
    <div class="lbl" id="fx-lbl">&gt; PTR</div>`;
  document.body.appendChild(cur);
  let tx=0,ty=0,cx=0,cy=0;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;});
  (function loop(){ cx+=(tx-cx)*.35; cy+=(ty-cy)*.35; cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  const lbl = cur.querySelector('#fx-lbl');
  function hot(label){ cur.classList.add('hot'); lbl.textContent='> '+label; }
  function cool(){ cur.classList.remove('hot'); }
  document.addEventListener('mouseover',e=>{
    const t = e.target.closest('button,a,select,.cat,.cc,.tier-block,.cal-mo,.feat-cta,input,.nav a,.close,.modal-bg');
    if(!t){ cool(); return; }
    const map = [
      ['.tier-block','OPEN DOSSIER'],
      ['.cat','CATEGORY'],
      ['.cc','NATION'],
      ['.cal-mo','MONTH'],
      ['select','SELECT'],
      ['.feat-cta','LAUNCH'],
      ['.close','CLOSE'],
      ['button','ACTION'],
      ['a','LINK']
    ];
    for(const [sel,l] of map){ if(t.matches(sel) || t.closest(sel)){ hot(l); return; } }
    hot('PTR');
  });
  document.addEventListener('mouseleave',cool);

  document.addEventListener('mousedown',e=>{
    const t = e.target.closest('button,.tier-block,.cat,.cc,.cal-mo,.nav a,a,.feat-cta');
    if(!t || t.matches('select')) return;
    const r = document.createElement('span'); r.className='fx-ripple';
    const rect = t.getBoundingClientRect();
    t.style.position = t.style.position || 'relative';
    t.style.overflow = 'hidden';
    r.style.left=(e.clientX-rect.left)+'px';
    r.style.top=(e.clientY-rect.top)+'px';
    t.appendChild(r);
    setTimeout(()=>r.remove(),700);
  });
}

const topbar = document.querySelector('.topbar .lights span');
if(topbar){
  const status = document.createElement('span');
  status.id='fx-status';
  status.style.marginLeft = '14px';
  topbar.parentElement.appendChild(status);
  setInterval(()=>{
    const lat = (20 + Math.random()*36).toFixed(0);
    const up = (99.7 + Math.random()*.29).toFixed(2);
    status.innerHTML = `· ${lat}ms · UP ${up}%`;
  }, 1100);
}

function triggerHeroMount(){
  const h1 = document.querySelector('.hero .h1');
  if(!h1) return;

  setInterval(()=>{
    const targets = document.querySelectorAll('.h1 .y, .h1 .o, .h1 .stk');
    const pick = targets[Math.floor(Math.random()*targets.length)];
    if(!pick) return;
    pick.classList.add('fx-glitch');
    if(!pick.dataset.text) pick.dataset.text = pick.textContent;
    pick.classList.add('go');
    setTimeout(()=>pick.classList.remove('go'), 650);
  }, 5500);
}

document.querySelectorAll('.sec-title').forEach(t=>{
  const inner = t.innerHTML;
  t.innerHTML = `<span class="fx-clip"><span class="fx-clip-inner">${inner}</span></span>`;
});

function animateCount(el, target, prefix='', suffix=''){
  const dur = 1200; const start = performance.now();
  function step(now){
    const k = Math.min(1,(now-start)/dur);
    const ease = 1 - Math.pow(1-k,3);
    el.textContent = prefix + Math.round(target*ease) + suffix;
    if(k<1) requestAnimationFrame(step);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(step);
}
function startStatCounters(){
  document.querySelectorAll('.hero-meta .v').forEach(el=>{
    if(el.dataset.done) return;
    el.dataset.done = '1';
    const raw = el.textContent.trim();
    let pre='', suf='', num=0;
    const m = raw.match(/^(\$?)(\d+)([A-Za-z%+]*)$/);
    if(m){ pre=m[1]; num=parseInt(m[2],10); suf=m[3]; }
    else { return; }
    animateCount(el, num, pre, suf);
  });
  document.querySelectorAll('.cal-mo .ct').forEach(el=>{
    if(el.dataset.done) return;
    el.dataset.done='1';
    const n = parseInt(el.textContent,10); if(isNaN(n)) return;
    el.textContent='0';
    animateCount(el, n);
  });
  document.querySelectorAll('.cc .ct').forEach(el=>{
    if(el.dataset.done) return;
    el.dataset.done='1';
    const n = parseInt(el.textContent,10); if(isNaN(n)) return;
    el.textContent='0';
    animateCount(el, n);
  });
}

const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      if(e.target.classList.contains('hero')) startStatCounters();
      if(e.target.classList.contains('cal') || e.target.closest('.sec') && e.target.matches('.cal')) startStatCounters();
      io.unobserve(e.target);
    }
  });
},{rootMargin:'-10% 0px -8% 0px'});

document.querySelectorAll('.sec, .feat, .marquee, .countries, .cal, .planner, .vs-sec, .tier-list, .hero-meta').forEach(el=>{
  el.classList.add('fx-reveal');
  io.observe(el);
});

setTimeout(startStatCounters, 1600);

document.querySelectorAll('.tier-block').forEach(el=>{
  el.classList.add('fx-tilt');
  el.addEventListener('mousemove',e=>{
    const r = el.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - .5;
    const py = (e.clientY-r.top)/r.height - .5;
    el.style.transform = `perspective(600px) rotateX(${-py*8}deg) rotateY(${px*10}deg) translate(-2px,-2px)`;
  });
  el.addEventListener('mouseleave',()=>{ el.style.transform=''; });
});

const vs = document.querySelector('.vs-vs');
const selA = document.querySelector('#vs-a-sel');
const selB = document.querySelector('#vs-b-sel');
function vsShake(winSide){
  if(vs){ vs.classList.remove('shatter'); void vs.offsetWidth; vs.classList.add('shatter'); }
  const a = document.getElementById('vs-A'), b = document.getElementById('vs-B');
  a && a.classList.remove('winning'); b && b.classList.remove('winning');
  if(winSide==='a' && a) a.classList.add('winning');
  if(winSide==='b' && b) b.classList.add('winning');
}
function evalVS(){
  if(!selA || !selB) return;

  setTimeout(()=>{
    const aw = document.querySelectorAll('#vs-a-stats .win').length;
    const bw = document.querySelectorAll('#vs-b-stats .win').length;
    vsShake(aw>bw?'a':bw>aw?'b':null);
  }, 50);
}
if(selA){ selA.addEventListener('change',evalVS); selB.addEventListener('change',evalVS); setTimeout(evalVS,500); }

const modalBg = document.querySelector('.modal-bg');
if(modalBg){
  new MutationObserver(()=>{
    if(modalBg.classList.contains('on')){
      const m = modalBg.querySelector('.modal');
      if(m){ m.style.animation='none'; void m.offsetWidth; m.style.animation=''; }
    }
  }).observe(modalBg,{attributes:true,attributeFilter:['class']});
}

const utc = document.getElementById('utc');
if(utc){
  utc.style.fontVariantNumeric='tabular-nums';
}

})();
