(function(){
'use strict';

const news = document.createElement('div');
news.className='fx-news';
news.innerHTML = `
  <div class="top">
    <div class="label">PRESS · MMXXVI · No. 042</div>
    <div class="masthead">Scholarship<em> · </em>Globe</div>
    <div class="sub">An open registry of funded opportunities</div>
  </div>
  <div class="bot">
    <div class="label">Filed from 142 countries</div>
  </div>
`;
document.body.appendChild(news);
setTimeout(()=>{
  news.classList.add('gone');
  setTimeout(()=>news.remove(), 1400);
  document.querySelector('.headline')?.classList.add('in');
  setTimeout(()=>{
    document.querySelector('.fx-corner-stamp')?.classList.add('on');
  }, 800);
}, 1100);

const isHover = matchMedia('(hover:hover)').matches;
if(isHover){
  const stamp = document.createElement('div');
  stamp.className='fx-stamp';
  stamp.innerHTML = `<span class="ico">PRESS</span>`;
  document.body.appendChild(stamp);
  let tx=0,ty=0,cx=0,cy=0;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;});
  (function loop(){ cx+=(tx-cx)*.35; cy+=(ty-cy)*.35; stamp.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  addEventListener('mouseover',e=>{
    const t = e.target.closest('a,button,select,input,.country-cell,.cert,.tag,.stack-item,.tl-item,.deadline-row,.qf,.search-input,.term');
    if(t) stamp.classList.add('hot'); else stamp.classList.remove('hot');
  });
  document.addEventListener('click',e=>{
    if(e.target.closest('select,input')) return;
    const imp = document.createElement('div');
    imp.className='fx-imp';
    imp.style.left=e.clientX+'px'; imp.style.top=e.clientY+'px';
    document.body.appendChild(imp);
    requestAnimationFrame(()=>imp.classList.add('go'));
    setTimeout(()=>imp.remove(), 900);
  });
}

const cs = document.createElement('div');
cs.className='fx-corner-stamp';
cs.innerHTML = `<div>VERIFIED<em>OPEN</em>REGISTRY<br/>EST · 2026</div>`;
document.body.appendChild(cs);

const headline = document.querySelector('.headline');
if(headline){

  function splitNode(node){
    if(node.nodeType===3){
      const text = node.textContent;
      const frag = document.createDocumentFragment();
      for(const ch of text){
        if(ch===' '||ch==='\n'){ frag.appendChild(document.createTextNode(ch)); continue; }
        const span = document.createElement('span');
        span.className='fx-ch';
        span.textContent = ch;
        frag.appendChild(span);
      }
      node.replaceWith(frag);
    } else if(node.nodeType===1 && node.tagName!=='BR'){
      Array.from(node.childNodes).forEach(splitNode);
    }
  }
  Array.from(headline.childNodes).forEach(splitNode);

  headline.querySelectorAll('.fx-ch').forEach((sp,i)=>{
    sp.style.transitionDelay = (1.2 + i*0.028)+'s';
  });
}

const io = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{rootMargin:'-8% 0px -8% 0px'});
document.querySelectorAll('.sec-head, .stats, .timeline, .stack-sec, .elig, .map-block, .ticker, .glossary, .foot, .hero').forEach(el=>{ el.classList.add('fx-rv'); io.observe(el); });
document.querySelectorAll('.sec-title').forEach(el=>io.observe(el));

function countUp(el, raw){

  const m = raw.match(/^(\D*)([\d,]+)(.*)$/);
  if(!m) return;
  const pre = m[1], n = parseInt(m[2].replace(/,/g,''),10), suf = m[3];
  if(isNaN(n)) return;
  const dur = 1400, start = performance.now();
  function step(t){
    const k = Math.min(1,(t-start)/dur);
    const e = 1-Math.pow(1-k,3);
    el.firstChild.textContent = pre + Math.round(n*e).toLocaleString();
    if(k<1) requestAnimationFrame(step);
    else el.firstChild.textContent = pre + n.toLocaleString();
  }
  requestAnimationFrame(step);
}
const statIO = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.stat-num').forEach(num=>{
        if(num.dataset.done) return;
        num.dataset.done='1';

        const txt = num.firstChild;
        if(txt && txt.nodeType===3){ countUp(num, txt.textContent.trim()); }
      });
      statIO.unobserve(e.target);
    }
  });
},{rootMargin:'-15% 0px'});
document.querySelectorAll('.stats').forEach(s=>statIO.observe(s));

const search = document.querySelector('.search-input');
if(search){
  const phrases = [
    'Search 1,840+ funded scholarships…',
    'e.g. Chevening UK Masters',
    'e.g. DAAD Germany PhD',
    'e.g. Fulbright United States',
    'e.g. MEXT Japan Research',
    'e.g. Erasmus Mundus Europe'
  ];
  let pi=0, ci=0, dir=1, last=performance.now();
  function tickType(t){
    if(document.activeElement===search) return requestAnimationFrame(tickType);
    if(t-last > (dir>0?70:35)){
      last = t;
      const target = phrases[pi];
      ci += dir;
      search.placeholder = target.slice(0,ci);
      if(ci===target.length){ dir=0; setTimeout(()=>{dir=-1;},1400); }
      else if(ci===0 && dir<0){ pi=(pi+1)%phrases.length; dir=1; }
    }
    requestAnimationFrame(tickType);
  }
  requestAnimationFrame(tickType);
}

document.querySelectorAll('.deadline-row').forEach(r=>{
  r.addEventListener('mouseenter',()=>{
    const d = r.querySelector('.dl-date .day');
    if(d){ d.style.transition='transform .35s cubic-bezier(.4,1.5,.4,1)'; d.style.transform='scale(1.15)'; }
  });
  r.addEventListener('mouseleave',()=>{
    const d = r.querySelector('.dl-date .day');
    if(d){ d.style.transform=''; }
  });
});

const mb = document.querySelector('.modal-bg');
if(mb){
  new MutationObserver(()=>{
    if(mb.classList.contains('on')){
      const m = mb.querySelector('.modal');
      if(m){ m.style.animation='none'; void m.offsetWidth; m.style.animation=''; }
    }
  }).observe(mb,{attributes:true,attributeFilter:['class']});
}

document.addEventListener('click',e=>{
  const t = e.target.closest('.tag');
  if(!t) return;
  t.style.transition='transform .25s cubic-bezier(.4,1.5,.4,1)';
  t.style.transform='scale(.85)';
  setTimeout(()=>{ t.style.transform=''; }, 160);
});

})();
