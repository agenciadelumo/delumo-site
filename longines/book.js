'use strict';
(() => {
  const pages=window.LONGINES_PAGES, $=id=>document.getElementById(id), cache=new Map();
  fetch('assets/longines-logo.svg').then(response=>response.ok?response.text():Promise.reject()).then(raw=>{
    const doc=new DOMParser().parseFromString(raw,'image/svg+xml');
    if(doc.querySelector('parsererror'))return;
    doc.querySelectorAll('script,foreignObject').forEach(el=>el.remove());
    const svg=doc.documentElement;svg.classList.add('brand-logo');
    document.querySelector('.book-identity img')?.replaceWith(svg);
  }).catch(()=>{});
  if(!Array.isArray(pages)||!pages.length){$('currentPage').textContent='Não foi possível abrir o livro. Recarregue a página.';return;}
  const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,busy=false,motionOff=motionQuery.matches,gesture=null,lastFocus=null;
  const details={
    bee:['Visitantes das Flores','Observe a abelha e descubra como suas visitas ajudam as flores. Cada descoberta completa uma parte do caderno.'],
    leaf:['Olhares Atentos','Compare folhas, formas e detalhes. Aprender a observar é o primeiro passo para conhecer as plantas.'],
    fungus:['Transformações','Fungos ajudam a transformar matéria orgânica. Uma descoberta sobre o que acontece no chão da floresta.'],
    frog:['Esconderijos','Cores e formas podem ajudar um animal a se esconder. Olhe com atenção e descubra a camuflagem.'],
    bird:['Observação','Observe as aves à distância e registre seus movimentos. A aventura valoriza o cuidado com os animais.'],
    seed:['Novos Caminhos','Descubra como as sementes podem chegar a novos lugares. Uma pista para entender o nascimento de outras plantas.'],
    star:['Uma conquista para guardar','O nome do jogador preenche a imagem da recompensa. Ao concluir o jogo, ela poderá ser enviada ao e-mail informado no início.'],
    eye:['Ouvir também é descobrir','Narração e descrições são recursos propostos para oferecer mais formas de explorar a aventura.'],
    ear:['Informações além do som','Legendas e sinais visuais ajudam a acompanhar as pistas. Os recursos serão validados com usuários.'],
    control:['Seu jeito de jogar','Controles adaptáveis e alternativas à precisão fazem parte da experiência proposta.'],
    calm:['Explorar no seu ritmo','Pausas, repetição de pistas e menos estímulos. Receber ajuda preserva as conquistas.'],
    tree:['Uma floresta para conhecer','Árvores, plantas, animais e fungos fazem parte das descobertas. A seleção final será confirmada pela curadoria.'],
    book:['Suas descobertas ficam no caderno','O álbum reúne registros ilustrados para revisitar o que foi aprendido durante a aventura.'],
    flag:['O primeiro passo do projeto','Uma missão completa servirá para testar a diversão, o aprendizado e o acesso antes de desenvolver toda a aventura.']
  };
  const zones={
    2:[['bee',707,283,78],['leaf',861,271,78],['fungus',1075,300,78],['frog',700,465,78],['bird',925,459,78],['seed',1100,463,78]],
    3:[['bee',162,281,78],['leaf',535,279,78],['fungus',994,317,78],['frog',1030,511,78],['bird',632,539,78],['seed',167,547,78]],
    7:[['bee',102,143,64],['bee',113,590,55]],
    8:[['bee',261,295,120],['leaf',640,295,120],['fungus',1019,295,120],['frog',261,524,120],['bird',640,524,120],['seed',1019,524,120]],
    9:[['tree',704,184,83],['leaf',909,184,83],['seed',1114,184,83],['fungus',704,361,83],['fungus',909,361,83],['fungus',1114,361,83],['bee',704,538,83],['frog',909,538,83],['bird',1114,538,83]],
    10:[['book',94,396,50],['star',94,482,50],['star',94,568,50]],
    11:[['eye',687,186,60],['ear',687,306,60],['control',687,426,60],['calm',687,546,60]],
    12:[['flag',162,351,61],['flag',600,351,61],['star',1060,351,61]],
    13:[['book',82,540,42],['leaf',293,540,42],['book',504,540,42]]
  };
  const safePage=n=>Math.max(0,Math.min(pages.length-1,Number(n)||0));
  const hashPage=()=>{const m=location.hash.match(/^#pagina-(\d+)$/);return m?safePage(Number(m[1])-1):0;};
  async function getSvg(index){
    if(!cache.has(index))cache.set(index,fetch(pages[index].image).then(async response=>{
      if(!response.ok)throw Error('Página indisponível');
      const raw=await response.text();
      const doc=new DOMParser().parseFromString(raw,'image/svg+xml');
      if(doc.querySelector('parsererror'))throw Error('Página inválida');
      doc.querySelectorAll('script,foreignObject').forEach(el=>el.remove());
      const svg=doc.documentElement;
      svg.querySelectorAll('image').forEach(el=>{
        const href=el.getAttribute('href')||el.getAttributeNS('http://www.w3.org/1999/xlink','href');
        if(href&&!href.startsWith('data:'))el.setAttributeNS('http://www.w3.org/1999/xlink','href',new URL('assets/'+href,document.baseURI).href);
      });
      svg.setAttribute('role','img');svg.setAttribute('aria-label',pages[index].description);
      return svg;
    }).catch(error=>{cache.delete(index);throw error;}));
    return (await cache.get(index)).cloneNode(true);
  }
  async function renderInto(container,index){
    try{container.replaceChildren(await getSvg(index));}
    catch(_){const image=new Image();image.src=pages[index].fallback;image.alt=pages[index].description;container.replaceChildren(image);}
  }
  function updateUI(){
    $('pageNumber').textContent=String(current+1).padStart(2,'0');$('pageTitle').textContent=pages[current].title;
    $('previous').disabled=current===0||busy;$('next').disabled=current===pages.length-1||busy;$('cornerNext').disabled=current===pages.length-1||busy;
    $('bookShell').classList.toggle('cover',current===0);
    $('announcement').textContent=`Página ${current+1} de ${pages.length}: ${pages[current].title}.`;
    [...$('pageDots').children].forEach((button,i)=>{button.classList.toggle('active',i===current);button.setAttribute('aria-current',i===current?'page':'false');});
    [...$('thumbnails').children].forEach((button,i)=>button.setAttribute('aria-current',String(i===current)));
  }
  function setMotion(value){
    motionOff=value;document.body.classList.toggle('static-motion',motionOff);
    $('motionButton').textContent=motionOff?'Animações reduzidas':'Animações ativas';$('motionButton').setAttribute('aria-pressed',String(motionOff));
  }
  function openDialog(dialog){lastFocus=document.activeElement;dialog.showModal();}
  function discovery(kind){const d=details[kind]||details.book;$('detailTitle').textContent=d[0];$('detailText').textContent=d[1];openDialog($('detailDialog'));}
  function markShapes(svg,pageZones){
    if(!svg)return;
    const bounds=svg.getBoundingClientRect();if(!bounds.width)return;
    const shapes=[...svg.querySelectorAll('path')].filter(path=>!path.closest('defs'));
    for(const path of shapes){
      const b=path.getBoundingClientRect();if(!b.width&&!b.height)continue;
      const x=(b.x-bounds.x+b.width/2)/bounds.width*1280,y=(b.y-bounds.y+b.height/2)/bounds.height*720;
      const zone=pageZones.findIndex(([,zx,zy,size])=>Math.hypot(x-zx,y-zy)<size*.43&&b.width/bounds.width*1280<size*.8&&b.height/bounds.height*720<size*.8);
      if(zone<0)continue;
      const fill=path.getAttribute('fill'),stroke=path.getAttribute('stroke');
      const accents=['#89f336','#ff8938','#ddb76a','#b47750','#e6ca8a','#cebb91'];
      if(fill&&accents.includes(fill.toLowerCase()))path.classList.add('has-color');
      if(stroke&&accents.includes(stroke.toLowerCase()))path.classList.add('has-stroke');
      const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.classList.add('creative-shape');group.dataset.zone=zone;
      path.parentNode.insertBefore(group,path);group.append(path);
    }
  }
  function buildHotspots(){
    const layer=$('hotspots');layer.replaceChildren();
    pages[current].links.forEach(link=>{
      const element=document.createElement(link.url?'a':'button');element.className='hotspot'+(link.url?' external':'');
      Object.assign(element.style,{left:link.left+'%',top:link.top+'%',width:link.width+'%',height:link.height+'%'});
      element.setAttribute('aria-label',link.label);element.title=link.label;
      if(link.url){element.href=link.url;element.target='_blank';element.rel='noopener noreferrer';}
      else{element.type='button';element.addEventListener('click',()=>go(link.page));}
      layer.append(element);
    });
    const pageZones=zones[current]||[];markShapes($('currentPage').querySelector('svg'),pageZones);
    pageZones.forEach(([kind,x,y,size],i)=>{
      const button=document.createElement('button');button.type='button';button.className='hotspot icon-zone';button.dataset.label=details[kind][0];button.setAttribute('aria-label','Descobrir: '+details[kind][0]);
      Object.assign(button.style,{left:(x-size/2)/1280*100+'%',top:(y-size/2)/720*100+'%',width:size/1280*100+'%',height:size/720*100+'%'});
      const active=value=>$('currentPage').querySelectorAll(`.creative-shape[data-zone="${i}"]`).forEach(shape=>shape.classList.toggle('is-active',value));
      button.addEventListener('pointerenter',()=>active(true));button.addEventListener('pointerleave',()=>active(false));button.addEventListener('focus',()=>active(true));button.addEventListener('blur',()=>active(false));button.addEventListener('click',()=>discovery(kind));layer.append(button);
    });
  }
  async function go(target,{animate=true,hash=true}={}){
    target=safePage(target);if(busy||target===current&&$('currentPage').querySelector('svg,img'))return;
    const old=current;busy=true;$('bookShell').classList.add('busy');updateUI();
    try{
      if(animate&&!motionOff&&target!==old){
        const front=await getSvg(old).catch(()=>null),back=await getSvg(target).catch(()=>null);
        if(front&&back){
          $('turnFront').replaceChildren(front);$('turnBack').replaceChildren(back);
          await renderInto($('currentPage'),target);
          $('turnSheet').className='turn-sheet visible'+(target<old?' reverse':'');
          await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
          $('turnSheet').classList.add('flipped');
          await new Promise(resolve=>{const sheet=$('turnSheet');let timer;const done=event=>{if(event&&event.target!==sheet)return;clearTimeout(timer);sheet.removeEventListener('transitionend',done);resolve();};sheet.addEventListener('transitionend',done);timer=setTimeout(done,1100);});
        }else await renderInto($('currentPage'),target);
      }else await renderInto($('currentPage'),target);
      current=target;
      if(hash)history.replaceState(null,'',`#pagina-${current+1}`);
    }finally{
      $('turnSheet').className='turn-sheet';$('turnFront').replaceChildren();$('turnBack').replaceChildren();
      busy=false;$('bookShell').classList.remove('busy');updateUI();buildHotspots();
      window.dispatchEvent(new CustomEvent('longines:page',{detail:{index:current}}));
      [current-1,current+1].filter(i=>i>=0&&i<pages.length).forEach(i=>getSvg(i).catch(()=>{}));
    }
  }
  pages.forEach((page,i)=>{
    const dot=document.createElement('button');dot.type='button';dot.title=`${i+1}. ${page.title}`;dot.setAttribute('aria-label',`Ir para página ${i+1}: ${page.title}`);dot.addEventListener('click',()=>go(i));$('pageDots').append(dot);
    const thumb=document.createElement('button');thumb.type='button';thumb.className='thumbnail';
    const image=new Image();image.src=page.thumbnail;image.alt='';image.loading='lazy';image.width=480;image.height=270;
    const label=document.createElement('b'),number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');label.append(number,document.createTextNode(page.title));thumb.append(image,label);thumb.setAttribute('aria-label',`Abrir página ${i+1}: ${page.title}`);
    thumb.addEventListener('click',()=>{$('indexDialog').close();go(i);});$('thumbnails').append(thumb);
  });
  $('next').addEventListener('click',()=>go(current+1));$('previous').addEventListener('click',()=>go(current-1));$('cornerNext').addEventListener('click',()=>go(current+1));
  $('indexButton').addEventListener('click',()=>openDialog($('indexDialog')));
  $('readButton').addEventListener('click',()=>{$('readTitle').textContent=pages[current].title;$('readText').textContent=pages[current].text;openDialog($('readDialog'));});
  $('zoomButton').addEventListener('click',async()=>{$('zoomTitle').textContent=pages[current].title;await renderInto($('zoomContent'),current);openDialog($('zoomDialog'));});
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(_){$('announcement').textContent='Este navegador não permite tela cheia. Use a ampliação para ver os detalhes.';}}
  $('fullscreenButton').addEventListener('click',fullscreen);
  document.addEventListener('fullscreenchange',()=>{const active=!!document.fullscreenElement;document.body.classList.toggle('reader-fullscreen',active);$('fullscreenButton').setAttribute('aria-label',active?'Sair da tela cheia':'Entrar em tela cheia');});
  $('motionButton').addEventListener('click',()=>setMotion(!motionOff));motionQuery.addEventListener('change',event=>setMotion(event.matches));
  document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});dialog.addEventListener('close',()=>lastFocus?.focus());});
  document.querySelector('.detail-ok').addEventListener('click',()=>$('detailDialog').close());
  document.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(event.key==='ArrowRight'){event.preventDefault();go(current+1);}else if(event.key==='ArrowLeft'){event.preventDefault();go(current-1);}else if(event.key==='Home'){event.preventDefault();go(0);}else if(event.key==='End'){event.preventDefault();go(pages.length-1);}else if(event.key.toLowerCase()==='i')openDialog($('indexDialog'));else if(event.key.toLowerCase()==='f')fullscreen();
  });
  $('pageFrame').addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'||event.target.closest('button,a'))return;gesture={x:event.clientX,y:event.clientY};});
  $('pageFrame').addEventListener('pointerup',event=>{if(!gesture)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;gesture=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)go(current+(dx<0?1:-1));});
  $('pageFrame').addEventListener('pointercancel',()=>gesture=null);
  window.addEventListener('hashchange',()=>go(hashPage(),{hash:false}));
  setMotion(motionOff);go(hashPage(),{animate:false,hash:false});
})();
