(function(){
'use strict';

const boot = document.createElement('div');
boot.className='fx-boot';
boot.innerHTML = `
  <div class="stamp">UNICOMPARE · TERMINAL v04 · BOOT SEQUENCE</div>
  <div class="b"><span class="k">[init]</span> mounting / · ext4 · ro</div>
  <div class="b"><span class="k">[load]</span> /opt/sources/qs-2026.json … <span class="ok">OK</span></div>
  <div class="b"><span class="k">[load]</span> /opt/sources/the-2026.json … <span class="ok">OK</span></div>
  <div class="b"><span class="k">[load]</span> /opt/sources/arwu-2025.json … <span class="ok">OK</span></div>
  <div class="b"><span class="k">[load]</span> /opt/sources/ipeds-2025.csv … <span class="ok">OK</span></div>
  <div class="b"><span class="k">[index]</span> 14,820 institutions · 196 countries</div>
  <div class="b"><span class="k">[ready]</span> session @ <span id="fxb-time">—</span></div>
  <div class="seal">Uni<small>compare · session live</small></div>
`;
document.body.appendChild(boot);
const lines = boot.querySelectorAll('.b');
let t = 80;
lines.forEach((l,i)=>{
  setTimeout(()=>{ l.classList.add('on'); }, t);
  t += 140;
});
const fxbTime = boot.querySelector('#fxb-time');
if(fxbTime){
  fxbTime.textContent = new Date().toISOString().replace('T',' ').slice(0,19)+' UTC';
}
setTimeout(()=>{
  boot.classList.add('gone');
  setTimeout(()=>boot.remove(), 600);
  document.querySelector('.fx-diag')?.classList.add('on');
}, 1700);

const isHover = matchMedia('(hover:hover)').matches;
if(isHover){
  const cur = document.createElement('div');
  cur.className='fx-cur';
  cur.innerHTML=`<span class="h"></span><span class="v"></span><span class="dot"></span><span class="coord" id="fx-coord">0,0</span>`;
  document.body.appendChild(cur);
  let tx=0,ty=0,cx=0,cy=0;
  const coord = cur.querySelector('#fx-coord');
  addEventListener('mousemove',e=>{
    tx=e.clientX;ty=e.clientY;
    coord.textContent = `${String(e.clientX).padStart(4,'0')},${String(e.clientY).padStart(4,'0')}`;
  });
  (function loop(){ cx+=(tx-cx)*.5; cy+=(ty-cy)*.5; cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  addEventListener('mouseover',e=>{
    const t = e.target.closest('a,button,select,input,tr,.guide,.check,.qf,.calc-toggle,.tag');
    if(t) cur.classList.add('hot'); else cur.classList.remove('hot');
  });
}

const diag = document.createElement('div');
diag.className='fx-diag';
diag.innerHTML = `
  <div><span class="k">net</span> · <span class="r">api.unicompare</span></div>
  <div><span class="k">lat</span> <span id="fx-lat">0</span>ms</div>
  <div><span class="k">tick</span> <span id="fx-tick">0</span></div>
`;
document.body.appendChild(diag);
let tickN = 0;
setInterval(()=>{
  document.getElementById('fx-lat').textContent = (18+Math.random()*14|0);
  document.getElementById('fx-tick').textContent = (++tickN).toString().padStart(4,'0');
}, 900);

const heroBlock = document.querySelector('.hero > div:first-child');
const h1 = document.querySelector('.hero h1');
if(h1 && !document.getElementById('fx-rotor-host')){
  const sub = document.createElement('div');
  sub.style.fontFamily = "'IBM Plex Mono',monospace";
  sub.style.fontSize = '12px';
  sub.style.letterSpacing = '.18em';
  sub.style.textTransform = 'uppercase';
  sub.style.color = '#3a3a36';
  sub.style.margin = '0 0 18px';
  sub.style.display = 'flex';
  sub.style.alignItems = 'baseline';
  sub.style.gap = '10px';
  sub.id = 'fx-rotor-host';
  sub.innerHTML = `
    <span style="color:#1d3f72">›</span> SESSION OBJECTIVE:
    <span class="fx-rotor" style="width:13ch;color:#1a1a1a;font-family:'Instrument Serif',serif;font-style:italic;font-size:18px">
      <span class="r-list">
        <span>research universities</span>
        <span>compare programs</span>
        <span>weigh tuition</span>
        <span>shortlist 5 schools</span>
        <span>plan applications</span>
        <span>research universities</span>
      </span>
    </span>
  `;
  h1.parentElement.insertBefore(sub, h1);
  const list = sub.querySelector('.r-list');
  const items = list.children;
  let idx = 0;
  setInterval(()=>{
    idx = (idx+1) % (items.length-1);
    list.style.transform = `translateY(-${idx*1.4}em)`;
  }, 2200);
}

const io = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{rootMargin:'-6% 0px -6% 0px'});
document.querySelectorAll('.sec, .meth, .ticker-row, .foot, .hero, .uni-table, .compare-panel, .calc, .odds').forEach(el=>{ el.classList.add('fx-rv'); io.observe(el); });
document.querySelectorAll('.sec-title').forEach(el=>io.observe(el));

const tickerCells = document.querySelectorAll('.ticker-cell');
const tickerState = {};
tickerCells.forEach((cell,i)=>{
  const v = cell.querySelector('.v');
  if(!v) return;
  const raw = v.textContent.trim();

  if(/[^\x00-\x7f]/.test(raw) || !/\d/.test(raw)) return;

  const m = raw.match(/^(\D*)([\d,\.]+)(.*)$/);
  if(!m) return;
  const pre = m[1], n = parseFloat(m[2].replace(/,/g,'')), suf = m[3];
  tickerState[i] = {el:v, pre, base:n, n, suf, decimals: (m[2].includes('.')?1:0)};
});
function formatN(n, dec){ return n.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}); }
setInterval(()=>{
  for(const k in tickerState){
    const st = tickerState[k];

    st.n = st.base + (Math.random()-.5)*st.base*.005;
    st.el.classList.remove('flick'); void st.el.offsetWidth; st.el.classList.add('flick');
    st.el.textContent = st.pre + formatN(st.n, st.decimals) + st.suf;
  }
}, 1800);

const clk = document.getElementById('clock');
if(clk){
  function tick(){
    const d = new Date();
    clk.textContent = d.toISOString().slice(11,19)+' UTC';
  }
  tick(); setInterval(tick,1000);
}

function makeSparkline(){
  const w=50, h=18, pts=12;
  const vals = [];
  let v = .5; for(let i=0;i<pts;i++){ v += (Math.random()-.5)*.3; v = Math.max(0.05,Math.min(.95,v)); vals.push(v); }
  let d = '';
  vals.forEach((p,i)=>{ const x = (i/(pts-1))*w; const y = h - p*h; d += (i?' L':'M')+x.toFixed(1)+' '+y.toFixed(1); });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);pointer-events:none"><path d="${d}" fill="none" stroke="#1d3f72" stroke-width="1.2"/></svg>`;
}
document.querySelectorAll('.uni-table tbody tr').forEach(row=>{
  row.style.position='relative';
  let spark;
  row.addEventListener('mouseenter',()=>{
    if(spark) return;
    spark = document.createElement('div');
    spark.innerHTML = makeSparkline();
    spark.firstChild.style.right = '4px';
    row.appendChild(spark.firstChild);
  });
  row.addEventListener('mouseleave',()=>{
    const svg = row.querySelector('svg'); if(svg) svg.remove(); spark = null;
  });
});

const sl = document.querySelector('.status-left');
if(sl){
  const tape = document.createElement('span');
  tape.id = 'fx-tape';
  sl.appendChild(tape);
  const msgs = ['QS 2026 INDEX OK','THE 2026 INDEX OK','IPEDS 2025 OK','NUMBEO MIRROR OK','VISA RULES OK','MIRROR US-EAST'];
  let i=0;
  setInterval(()=>{ tape.textContent = '· '+msgs[i++%msgs.length]; }, 2200);
  tape.textContent = '· '+msgs[0];
}

})();
