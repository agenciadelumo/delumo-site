/* ---------- vídeo MetaTrade: autoplay mudo + som ao clicar ---------- */
(function(){
  var wrap=document.getElementById('mt-video'),frame=document.getElementById('mt-player'),btn=document.getElementById('mt-sound');
  if(!wrap||!frame||!btn)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    // sem autoplay: player padrão com controles
    frame.src='https://www.youtube-nocookie.com/embed/-C6du1R1xyg?rel=0&playsinline=1';
    wrap.classList.add('controls-on');
    btn.remove();
    return;
  }
  var soundOn=false;
  function cmd(func){frame.contentWindow.postMessage(JSON.stringify({event:'command',func:func,args:[]}),'*');}
  btn.addEventListener('click',function(){
    soundOn=!soundOn;
    if(soundOn){cmd('unMute');cmd('playVideo');btn.innerHTML='🔊&nbsp; Desativar som';btn.setAttribute('aria-pressed','true');}
    else{cmd('mute');btn.innerHTML='🔇&nbsp; Ativar som';btn.setAttribute('aria-pressed','false');}
  });
})();

/* ---------- mapa animado estilo War: time comercial conquista os leads ---------- */
(function(){
  var cv=document.getElementById('map-canvas');
  if(!cv) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var ctx=cv.getContext('2d'),W,H,DPR;
  var LIMA='#B4F428',VIVO='#2EBF5B',AREIA='#F4F1E8';
  var nodes=[],edges=[],pulses=[],particles=[],lastConquer=0,doneAt=0;

  function hyp(a,b){return Math.sqrt(a*a+b*b);}

  function seed(){
    nodes=[];edges=[];pulses=[];particles=[];doneAt=0;
    var cols=Math.max(5,Math.round(W/230)),rows=Math.max(3,Math.round(H/230));
    var gx=W/(cols+1),gy=H/(rows+1),id=0;
    for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
      nodes.push({id:id++,
        x:gx*(c+1)+(Math.random()-.5)*gx*0.5,
        y:gy*(r+1)+(Math.random()-.5)*gy*0.5,
        rad:4+Math.random()*3,owner:0,conquerAt:-1});
    }
    window._gx=gx;
    for(var i=0;i<nodes.length;i++)for(var j=i+1;j<nodes.length;j++){
      var a=nodes[i],b=nodes[j],d=hyp(a.x-b.x,a.y-b.y);
      if(d<gx*1.45)edges.push({a:i,b:j});
    }
    var start=nodes.reduce(function(m,n){return (n.x+n.y<m.x+m.y)?n:m;},nodes[0]);
    start.owner=1;start.conquerAt=performance.now();start.base=true;
  }
  function neigh(idx){var o=[];for(var k=0;k<edges.length;k++){var e=edges[k];if(e.a===idx)o.push(e.b);else if(e.b===idx)o.push(e.a);}return o;}

  function spread(now){
    if(now-lastConquer<640)return;
    lastConquer=now;
    var owned=nodes.filter(function(n){return n.owner===1;});
    if(!owned.length)return;
    var frontier=[];
    owned.forEach(function(n){neigh(n.id).forEach(function(nb){if(nodes[nb].owner===0)frontier.push({from:n.id,to:nb});});});
    if(!frontier.length){
      if(!doneAt)doneAt=now;
      if(now-doneAt>2800)seed();
      return;
    }
    var p=frontier[Math.floor(Math.random()*frontier.length)];
    pulses.push({from:p.from,to:p.to,dur:580,start:now});
  }
  function burst(x,y){for(var i=0;i<9;i++){var a=Math.random()*6.28,s=.5+Math.random()*2;particles.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,r:1+Math.random()*1.8});}}

  function draw(now){
    ctx.clearRect(0,0,W,H);
    // arestas
    for(var k=0;k<edges.length;k++){
      var e=edges[k],a=nodes[e.a],b=nodes[e.b],both=a.owner===1&&b.owner===1;
      ctx.strokeStyle=both?'rgba(180,244,40,0.26)':'rgba(244,241,232,0.05)';
      ctx.lineWidth=both?1.4:1;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
    // pulsos
    for(var i=pulses.length-1;i>=0;i--){
      var p=pulses[i],t=(now-p.start)/p.dur,a=nodes[p.from],b=nodes[p.to];
      if(t>=1){b.owner=1;b.conquerAt=now;burst(b.x,b.y);pulses.splice(i,1);continue;}
      var x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
      ctx.strokeStyle=LIMA;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(x,y);ctx.stroke();
      ctx.fillStyle=LIMA;ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();
    }
    // nós
    for(var n2=0;n2<nodes.length;n2++){
      var n=nodes[n2],conq=n.owner===1;
      if(conq&&n.conquerAt>0){
        var age=(now-n.conquerAt)/700;
        if(age<1){ctx.strokeStyle='rgba(180,244,40,'+(1-age)*0.55+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(n.x,n.y,n.rad+age*17,0,7);ctx.stroke();}
      }
      if(n.base){
        // base do time comercial: anel duplo pulsante
        var pl=1+Math.sin(now/400)*0.12;
        ctx.strokeStyle=LIMA;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(n.x,n.y,(n.rad+7)*pl,0,7);ctx.stroke();
      }
      ctx.beginPath();ctx.arc(n.x,n.y,n.rad,0,7);
      if(conq){ctx.fillStyle=LIMA;ctx.shadowColor=LIMA;ctx.shadowBlur=11;ctx.fill();ctx.shadowBlur=0;}
      else{ctx.fillStyle='rgba(244,241,232,0.15)';ctx.fill();ctx.strokeStyle='rgba(244,241,232,0.30)';ctx.lineWidth=1.3;ctx.stroke();}
    }
    // partículas
    for(var q=particles.length-1;q>=0;q--){
      var pt=particles[q];pt.x+=pt.vx;pt.y+=pt.vy;pt.vx*=.94;pt.vy*=.94;pt.life-=.03;
      if(pt.life<=0){particles.splice(q,1);continue;}
      ctx.globalAlpha=pt.life;ctx.fillStyle=VIVO;ctx.beginPath();ctx.arc(pt.x,pt.y,pt.r,0,7);ctx.fill();ctx.globalAlpha=1;
    }
    spread(now);
    requestAnimationFrame(draw);
  }
  function resize(){
    DPR=Math.min(window.devicePixelRatio||1,2);
    W=cv.clientWidth;H=cv.clientHeight;
    cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
    seed();
  }
  window.addEventListener('resize',resize);
  resize();requestAnimationFrame(draw);
})();

(function(){
  var modal=document.getElementById('modal'),box=document.getElementById('modal-box');
  function open(id){
    box.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Vídeo do projeto" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    modal.classList.add('open');document.body.style.overflow='hidden';
  }
  function close(){modal.classList.remove('open');box.innerHTML='';document.body.style.overflow='';}
  document.querySelectorAll('[data-yt]').forEach(function(el){
    el.addEventListener('click',function(){open(el.getAttribute('data-yt'));});
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el.getAttribute('data-yt'));}});
  });
  document.getElementById('modal-close').addEventListener('click',close);
  modal.addEventListener('click',function(e){if(e.target===modal)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();

/* ---------- header inteligente: encolhe ao rolar + link ativo ---------- */
(function(){
  var header=document.querySelector('header');
  if(!header)return;
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>40);}
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
  var links=document.querySelectorAll('.menu a[href^="#"], .menu a[href^="index.html#"]');
  var secs=[];
  links.forEach(function(a){
    var id=a.getAttribute('href').split('#')[1];
    var el=id?document.getElementById(id):null;
    if(el)secs.push({a:a,el:el});
  });
  if(secs.length){
    window.addEventListener('scroll',function(){
      var y=window.scrollY+120,cur=null;
      secs.forEach(function(s){if(s.el.offsetTop<=y)cur=s;});
      secs.forEach(function(s){s.a.classList.toggle('active',s===cur);});
    },{passive:true});
  }
})();

/* ---------- menu mobile ---------- */
(function(){
  var btn=document.getElementById('menu-btn'),nav=document.getElementById('mobile-nav');
  if(!btn||!nav)return;
  function close(){nav.classList.remove('open');document.body.style.overflow='';}
  btn.addEventListener('click',function(){nav.classList.add('open');document.body.style.overflow='hidden';});
  nav.querySelectorAll('a,.close-nav').forEach(function(el){el.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();

/* ---------- revelação ao rolar ---------- */
(function(){
  var els=document.querySelectorAll('.rv');
  if(!els.length||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:.12});
  els.forEach(function(e){io.observe(e);});
})();

/* ---------- contadores animados ---------- */
(function(){
  var els=document.querySelectorAll('[data-count]');
  if(!els.length)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function animate(el){
    var target=parseInt(el.getAttribute('data-count'),10);
    var prefix=el.getAttribute('data-prefix')||'',suffix=el.getAttribute('data-suffix')||'';
    if(reduce){el.textContent=prefix+target.toLocaleString('pt-BR')+suffix;return;}
    var start=null,dur=1600;
    function step(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      el.textContent=prefix+Math.round(target*eased).toLocaleString('pt-BR')+suffix;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if(!('IntersectionObserver' in window)){els.forEach(animate);return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){animate(en.target);io.unobserve(en.target);}});
  },{threshold:.4});
  els.forEach(function(e){io.observe(e);});
})();
