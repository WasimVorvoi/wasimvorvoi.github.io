(function(){
'use strict';

const curtain = document.createElement('div');
curtain.className='fx-curtain';
curtain.innerHTML = `
  <div class="pane"></div><div class="pane"></div><div class="pane"></div><div class="pane"></div>
  <div class="ink-sig">
    <span class="sig-l">Vol. I · Opening</span>
    The <em>atlas</em> of human language
  </div>
`;
document.body.appendChild(curtain);
requestAnimationFrame(()=>{
  setTimeout(()=>{
    curtain.classList.add('gone');
    setTimeout(()=>curtain.remove(), 1500);
    document.querySelector('.hero h1')?.classList.add('in');
  }, 800);
});

const isHover = matchMedia('(hover:hover)').matches;
let nib, canvas, ctx, trail=[];
if(isHover){
  canvas = document.createElement('canvas');
  canvas.className = 'fx-ink-canvas';
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  function resizeC(){ canvas.width = innerWidth*devicePixelRatio; canvas.height = innerHeight*devicePixelRatio; canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; ctx.scale(devicePixelRatio,devicePixelRatio); }
  resizeC(); addEventListener('resize',resizeC);

  nib = document.createElement('div');
  nib.className='fx-nib';
  nib.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M3 21 L12 12 L21 21 L15 14 L9 14 Z" fill="#2a1810" stroke="#2a1810" stroke-width="1.2"/><circle cx="12" cy="13" r="1.2" fill="#a83232"/></svg>`;
  document.body.appendChild(nib);

  let lx=null,ly=null;
  addEventListener('mousemove',e=>{
    nib.style.left=e.clientX+'px';
    nib.style.top=e.clientY+'px';
    if(lx!==null){
      const dx = e.clientX-lx, dy = e.clientY-ly;
      const dist = Math.hypot(dx,dy);
      trail.push({x:e.clientX,y:e.clientY,t:performance.now(),lx,ly,w:Math.max(.5, 3 - dist*.05)});

      nib.style.transform = `translate(-50%,-50%) rotate(${Math.atan2(dy,dx)*180/Math.PI - 90}deg)`;
    }
    lx=e.clientX; ly=e.clientY;
  });

  addEventListener('mouseover',e=>{
    const t = e.target.closest('a,button,.glyph-cell,.cat,.cert,.method,.level,.quiz-opt,.tier-block,.cc,.cal-mo,select,input');
    if(t) nib.classList.add('hot'); else nib.classList.remove('hot');
  });

  function paint(){
    const now = performance.now();
    ctx.clearRect(0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);
    trail = trail.filter(p=>now-p.t<1500);
    ctx.lineCap='round';
    for(let i=1;i<trail.length;i++){
      const p = trail[i], q = trail[i-1];
      const age = (now-p.t)/1500;
      ctx.globalAlpha = (1-age)*.55;
      ctx.strokeStyle = '#2a1810';
      ctx.lineWidth = p.w*(1-age*.5);
      ctx.beginPath();
      ctx.moveTo(q.x,q.y);
      ctx.lineTo(p.x,p.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(paint);
  }
  paint();
}

const h1 = document.querySelector('.hero h1');
if(h1){

  const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT, null);

  const newHTML = Array.from(h1.childNodes).map(node=>{
    if(node.nodeType===3){

      return node.textContent.split(/(\s+)/).map(w=>{
        if(!w.trim()) return w;
        return `<span class="fx-word"><span>${w}</span></span>`;
      }).join('');
    }
    if(node.tagName==='BR') return '<br>';

    const tag = node.outerHTML;
    return `<span class="fx-word"><span>${tag}</span></span>`;
  }).join('');
  h1.innerHTML = newHTML;

  h1.querySelectorAll('.fx-word > span').forEach((sp,i)=>{
    sp.style.transitionDelay = (i*0.07 + 1.0)+'s';
  });
}

document.querySelectorAll('.sec-title, .quiz-head h3, .fluency h3, .roadmap h2, .foot-logo').forEach(t=>{
  const span = document.createElement('span');
  span.className='fx-rv-mask';
  span.innerHTML = t.innerHTML;
  t.innerHTML = '';
  t.appendChild(span);
});

const io = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{rootMargin:'-8% 0px -6% 0px'});
document.querySelectorAll('.sec, .roadmap, .hero, .stats, .foot, .deco-line').forEach(el=>{ el.classList.add('fx-rv'); io.observe(el); });
document.querySelectorAll('.fx-rv-mask').forEach(el=>io.observe(el));

const statIO = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.stat-num').forEach(num=>{
        if(num.dataset.done) return;
        num.dataset.done='1';

        const em = num.querySelector('em');
        const target = em ? em : num;
        const raw = target.textContent.trim();
        const m = raw.match(/^([\d,]+)(.*)$/);
        if(!m) return;
        const n = parseInt(m[1].replace(/,/g,''),10);
        const suf = m[2];
        animateNum(target, n, suf);
      });
      statIO.unobserve(e.target);
    }
  });
},{rootMargin:'-10% 0px'});
document.querySelectorAll('.stats').forEach(s=>statIO.observe(s));

function animateNum(el, target, suf=''){
  const dur = 1400, start = performance.now();
  function step(t){
    const k = Math.min(1,(t-start)/dur);
    const e = 1-Math.pow(1-k,3);
    const v = Math.round(target*e);
    el.textContent = v.toLocaleString()+suf;
    if(k<1) requestAnimationFrame(step); else el.textContent = target.toLocaleString()+suf;
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('.glyph-cell').forEach(cell=>{
  cell.addEventListener('mousemove',e=>{
    const r = cell.getBoundingClientRect();
    cell.style.setProperty('--x',((e.clientX-r.left)/r.width*100)+'%');
    cell.style.setProperty('--y',((e.clientY-r.top)/r.height*100)+'%');
    cell.style.setProperty('--r','0%');
  });
  cell.addEventListener('mouseenter',e=>{
    const r = cell.getBoundingClientRect();
    cell.style.setProperty('--x',((e.clientX-r.left)/r.width*100)+'%');
    cell.style.setProperty('--y',((e.clientY-r.top)/r.height*100)+'%');
    requestAnimationFrame(()=>{
      cell.style.transition = '--r .8s cubic-bezier(.3,.7,.3,1)';
      cell.style.setProperty('--r','100%');
    });
  });
  cell.addEventListener('mouseleave',()=>{
    cell.style.setProperty('--r','0%');
  });
});

const quizCard = document.querySelector('.quiz-card');
const quizNext = document.getElementById('quiz-next');
if(quizNext){
  quizNext.addEventListener('click',()=>{
    if(!quizCard) return;
    quizCard.classList.remove('flipping'); void quizCard.offsetWidth; quizCard.classList.add('flipping');
  });
}

const optsContainer = document.getElementById('quiz-options');
if(optsContainer){
  optsContainer.addEventListener('click',e=>{
    const btn = e.target.closest('.quiz-opt');
    if(!btn) return;

    setTimeout(()=>{
      if(btn.classList.contains('correct')) confetti();
      else if(btn.classList.contains('wrong')) inkBlot();
    }, 20);
  },true);
}

function confetti(){
  const wrap = document.createElement('div');
  wrap.className='fx-confetti';
  document.body.appendChild(wrap);
  const colors = ['','r','g'];
  for(let i=0;i<60;i++){
    const p = document.createElement('span');
    p.className='ptl '+colors[i%3];
    const x = innerWidth/2 + (Math.random()-.5)*200;
    const y = innerHeight*.45;
    const angle = (Math.random()*Math.PI*2);
    const speed = 350+Math.random()*420;
    const vx = Math.cos(angle)*speed;
    const vy = Math.sin(angle)*speed - 600;
    p.style.left = x+'px';
    p.style.top = y+'px';
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    wrap.appendChild(p);
    const dur = 1100+Math.random()*900;
    p.animate([
      {transform:`translate(0,0) rotate(0deg)`, opacity:1},
      {transform:`translate(${vx*dur/1000}px, ${vy*dur/1000 + .5*1200*Math.pow(dur/1000,2)}px) rotate(${Math.random()*720}deg)`, opacity:0}
    ],{duration:dur,easing:'cubic-bezier(.2,.6,.4,1)',fill:'forwards'});
  }
  setTimeout(()=>wrap.remove(), 2200);
}
function inkBlot(){
  const blot = document.createElement('div');
  blot.className='fx-blot';
  document.body.appendChild(blot);
  requestAnimationFrame(()=>blot.classList.add('on'));
  setTimeout(()=>{ blot.style.opacity='0'; }, 400);
  setTimeout(()=>blot.remove(), 1000);
}

const yearsEl = document.getElementById('fl-years');
if(yearsEl){
  const mo = new MutationObserver(()=>{
    yearsEl.classList.remove('bump'); void yearsEl.offsetWidth; yearsEl.classList.add('bump');
  });
  mo.observe(yearsEl,{childList:true,characterData:true,subtree:true});
}

const foot = document.querySelector('.foot');
if(foot){
  const seal = document.createElement('div');
  seal.className='fx-seal';
  seal.innerHTML = `EX<br/>LIBRIS<br/>MMXXVI`;
  foot.appendChild(seal);
  new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting) seal.classList.add('on'); });
  },{rootMargin:'-20% 0px'}).observe(foot);
}

const day = document.getElementById('day');
if(day){
  const d = new Date();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  day.textContent = `${months[d.getMonth()]} ${d.getDate()} · ${d.getFullYear()}`;
}

})();
