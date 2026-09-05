'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { Action, DelumoMark, Logo } from './brand';
import NetworkCanvas from './network';
import { useMotion } from './motion';

export default function HeroCarousel() {
  const [slide,setSlide]=useState(0);
  const [held,setHeld]=useState(false);
  const [visible,setVisible]=useState(true);
  const [pageVisible,setPageVisible]=useState(true);
  const root=useRef<HTMLElement>(null);
  const {paused,toggle}=useMotion();
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));
    if(root.current)observer.observe(root.current);
    const visibility=()=>setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange',visibility);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{
    if(paused || held || !visible || !pageVisible)return;
    const timer=window.setInterval(()=>setSlide(current=>(current+1)%2),4000);
    return()=>window.clearInterval(timer);
  },[paused,held,visible,pageVisible,slide]);
  const choose=(index:number)=>setSlide((index+2)%2);
  return <section ref={root} className="hero-carousel" aria-roledescription="carrossel" aria-label="Soluções Delumo" data-slide={slide} onFocusCapture={()=>setHeld(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setHeld(false);}}>
    <div className={`cover-slide map-cover ${slide===0?'is-active':''}`} aria-hidden={slide!==0} inert={slide!==0} role="group" aria-roledescription="slide" aria-label="1 de 2: Conhecimento e tecnologia">
      <NetworkCanvas active={slide===0}/><div className="map-cover-shade"/>
      <div className="container cover-content"><p className="eyebrow">CONHECIMENTO. TECNOLOGIA. EXPERIÊNCIA.</p><h1><Logo/></h1><p className="cover-signature">Treinar. Jogar. Evoluir.</p><p className="cover-description">Desenvolvemos pessoas.<br/><strong>Conectamos possibilidades.</strong></p><p className="cover-support">Treinamentos, games e plataformas sob medida para transformar o dia a dia da sua empresa.</p><div className="cover-actions"><Action href="#solucoes">Explore as soluções</Action><a href="/projetos">Nossos projetos <ArrowUpRight size={19}/></a></div></div>
    </div>
    <div className={`cover-slide training-cover ${slide===1?'is-active':''}`} aria-hidden={slide!==1} inert={slide!==1} role="group" aria-roledescription="slide" aria-label="2 de 2: Treinamentos imersivos">
      <img className="training-cover-image" src="/media/immersive-team.webp" alt="Equipe em treinamento com óculos de realidade virtual e orientação de um facilitador" width="1774" height="887" fetchPriority="high"/>
      <div className="training-cover-shade"/>
      <div className="container cover-content"><p className="eyebrow">PESSOAS NO CENTRO. EXPERIÊNCIA NA PRÁTICA.</p><h2>Treinamentos<br/><em>imersivos.</em></h2><p className="cover-description">Realidade virtual e avatares.<br/><strong>Aprendizagem na prática.</strong></p><p className="cover-support">Integração, segurança, qualidade e vendas em experiências que conectam conteúdo à rotina.</p><div className="cover-actions"><Action href="/solucoes/rh">Soluções para sua equipe</Action></div></div>
      <a className="rotating-delumo" href="/solucoes/imersao" aria-label="Conheça os treinamentos imersivos"><DelumoMark/><ArrowUpRight className="rotating-arrow" size={26}/></a>
    </div>
    <div className="container cover-navigation"><a className="cover-scroll" href="#solucoes"><ArrowDownRight size={22}/><span>Explore novas possibilidades</span></a><div className="cover-controls"><button onClick={()=>choose(slide-1)} aria-label="Capa anterior" title="Capa anterior"><ArrowLeft size={18}/></button><div className="cover-dots">{['Conhecimento e tecnologia','Treinamentos imersivos'].map((name,index)=><button key={name} onClick={()=>choose(index)} aria-label={`Mostrar capa: ${name}`} aria-pressed={slide===index}><span/></button>)}</div><button onClick={()=>choose(slide+1)} aria-label="Próxima capa" title="Próxima capa"><ArrowRight size={18}/></button><button onClick={toggle} aria-label={paused?'Reproduzir capas':'Pausar capas'} title={paused?'Reproduzir capas':'Pausar capas'}>{paused?<Play size={16}/>:<Pause size={16}/>}</button></div></div>
  </section>;
}
