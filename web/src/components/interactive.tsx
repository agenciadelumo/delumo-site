'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { ArrowRight, ArrowUpRight, Check, Eye, EyeOff, LockKeyhole, Play, Sparkles, X } from 'lucide-react';
import { useMotion } from './motion';
import { Icon } from './brand';
import { contact, solutions, trainingGroups } from '@/data/content';

const bands = [
  ['Treinamentos', 'Gamificação', 'Projetos 3D', 'Plataformas', 'Imersão'],
  ['Treinar', 'Jogar', 'Evoluir', 'Conectar', 'Transformar'],
];

// Two independent continuous tracks adapted from Acjon's TextSliderArea.
export function TextSliderArea() {
  const { paused } = useMotion();
  const sliders = useRef<SwiperInstance[]>([]);
  useEffect(() => { sliders.current.forEach(swiper => paused ? swiper.autoplay?.stop() : swiper.autoplay?.start()); }, [paused]);
  return <div className="text-slider-area" aria-label="Treinamentos, gamificação, projetos 3D, plataformas e imersão"><div className="text-slider-tracks" aria-hidden="true">{bands.map((words, index) => <div className={`text-slider ${index ? 'style-2' : ''}`} key={index} dir={index ? 'ltr' : 'rtl'}><Swiper modules={[Autoplay]} slidesPerView="auto" loop speed={7000} allowTouchMove={false} autoplay={paused ? false : { delay: 0, disableOnInteraction: false }} onSwiper={swiper => { sliders.current[index] = swiper; }} >{[...words,...words,...words].map((word,i) => <SwiperSlide key={`${word}-${i}`}><span className={i % 2 ? 'stroke-text' : ''}>{word}</span><Sparkles size={index ? 30 : 22} strokeWidth={1.5} /></SwiperSlide>)}</Swiper></div>)}</div></div>;
}

export function LearningPaths() {
  const [selected, setSelected] = useState(0);
  function changeTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % trainingGroups.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + trainingGroups.length - 1) % trainingGroups.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = trainingGroups.length - 1;
    else return;
    event.preventDefault(); setSelected(next); document.getElementById(`training-tab-${next}`)?.focus();
  }
  return <div className="learning-paths"><div className="training-tabs" role="tablist" aria-label="Áreas de treinamento">{trainingGroups.map((item,i) => <button id={`training-tab-${i}`} key={item.name} role="tab" aria-selected={i === selected} aria-controls={`training-panel-${i}`} tabIndex={i === selected ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={event => changeTab(event,i)}><Icon name={item.icon} size={23}/><span>{item.name}</span><ArrowUpRight size={18}/></button>)}</div>{trainingGroups.map((group,index)=><div key={group.name} className="training-panel" id={`training-panel-${index}`} role="tabpanel" aria-labelledby={`training-tab-${index}`} hidden={index!==selected} tabIndex={0}><div className="training-panel-copy"><p className="eyebrow">TRILHA DE CONHECIMENTO</p><h3>{group.title}</h3><p>{group.text}</p><a className="text-link" href="/solucoes/treinamentos">Conheça os formatos <ArrowUpRight size={18}/></a></div><ol className="path-steps">{group.modules.map((module,i) => <li key={module}><span className="path-node">{i === 3 ? <Check size={18}/> : `0${i+1}`}</span><div><small>Etapa {i+1}</small><strong>{module}</strong></div></li>)}</ol></div>)}</div>;
}

export function VideoPlayer({ id, poster, title }: { id: string; poster: string; title: string }) {
  const [playing,setPlaying] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useEffect(()=>{const disclosure=container.current?.closest('details');if(!disclosure)return;const stop=()=>{if(!disclosure.open)setPlaying(false);};disclosure.addEventListener('toggle',stop);return()=>disclosure.removeEventListener('toggle',stop);},[]);
  return <div className="video-player" ref={container}>{playing ? <><iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&controls=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/><button className="video-close icon-button" onClick={() => setPlaying(false)} aria-label={`Fechar vídeo: ${title}`} title="Fechar vídeo"><X size={18}/></button></> : <button className="video-cover" onClick={() => setPlaying(true)} aria-label={`Reproduzir vídeo: ${title}`}><img src={poster} alt={title} width="1280" height="720" loading="lazy"/><span className="play-button"><Play size={26} fill="currentColor"/></span><span className="video-caption">{title}<span>Assistir <ArrowUpRight size={15}/></span></span></button>}</div>;
}

const tours = [
  ['Conveniência','conveniencia-ok'], ['Bar A/B','bar-ab-correto'], ['Bar C/D','bar-cd-correto'],
  ['Padaria','padaria-correto'], ['Adega','adega-ok'], ['Mercado','mercado-certo'],
];

export function DemoGate() {
  const [selected,setSelected] = useState<number | null>(null);
  const [password,setPassword] = useState('');
  const [visible,setVisible] = useState(false);
  const [error,setError] = useState('');
  const [authorized,setAuthorized] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (selected === null) { dialog.current?.close(); return; } setPassword('');setError('');setVisible(false);setAuthorized(false);dialog.current?.showModal(); },[selected]);
  function submit(event: FormEvent) {
    event.preventDefault();
    // Presentation-only gate retained from the previous static site; not server authentication.
    if (password !== 'Delumo@123') {setError('Senha incorreta. Confira e tente novamente.');return;}
    setAuthorized(true);setError('');
    const popup = window.open(`https://meutour360.com/tour-360/${tours[selected!][1]}`,'_blank','noopener,noreferrer');
    void popup;
  }
  return <div className="demo-gate"><div className="demo-heading"><strong>Explore os 6 ambientes</strong><span><LockKeyhole size={14}/> Demonstração com senha</span></div><div className="tour-grid">{tours.map(([title],i) => <button key={title} onClick={() => setSelected(i)}><span>{title}</span><LockKeyhole size={16}/></button>)}</div><dialog className="demo-dialog" aria-labelledby="demo-dialog-title" ref={dialog} onCancel={() => setSelected(null)} onClick={event => {if(event.target===dialog.current)setSelected(null);}}><div className="dialog-content"><button className="icon-button dialog-close" onClick={() => setSelected(null)} aria-label="Fechar demonstração"><X/></button><span className="dialog-symbol"><LockKeyhole size={28}/></span><p className="eyebrow">METATRADE {selected !== null ? `/ ${tours[selected][0]}` : ''}</p><h2 id="demo-dialog-title">SOLICITE A SENHA DE DEMONSTRAÇÃO</h2>{authorized ? <div className="demo-success"><p><Check size={20}/> Acesso liberado.</p><a className="action" href={`https://meutour360.com/tour-360/${tours[selected!][1]}`} target="_blank" rel="noopener noreferrer">Abrir ambiente <ArrowUpRight size={18}/></a></div> : <><p>Recebeu a senha? Informe abaixo para acessar este ambiente.</p><form onSubmit={submit}><label htmlFor="demo-password">Senha de demonstração</label><div className="password-input"><input id="demo-password" type={visible ? 'text' : 'password'} value={password} onChange={event => {setPassword(event.target.value);setError('');}} required autoComplete="off" autoFocus aria-invalid={!!error} aria-describedby={error ? 'demo-error' : undefined}/><button type="button" className="icon-button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}>{visible ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>{error && <p id="demo-error" className="form-error" role="alert">{error}</p>}<button className="action" type="submit">Acessar demonstração <ArrowRight size={18}/></button></form><a className="request-password" href="https://wa.me/5554981302517?text=Ol%C3%A1%2C%20Guto!%20Quero%20solicitar%20a%20senha%20de%20demonstra%C3%A7%C3%A3o%20do%20MetaTrade." target="_blank" rel="noopener noreferrer">Solicitar a senha com Guto Luz <ArrowUpRight size={16}/></a></>}</div></dialog></div>;
}

export function ContactForm() {
  const [solution,setSolution]=useState('');
  const [prepared,setPrepared]=useState('');
  useEffect(()=>{const slug=new URLSearchParams(window.location.search).get('solucao');if(solutions.some(item=>item.slug===slug))setSolution(slug!);},[]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name=solutions.find(item=>item.slug===solution)?.name || 'um projeto digital';
    const message = `Olá, Guto! Sou ${fields.get('name')}, da empresa ${fields.get('company') || 'não informada'}. Quero conversar sobre ${name}.\n\n${fields.get('message')}`;
    const url=`https://wa.me/5554981302517?text=${encodeURIComponent(message)}`;
    setPrepared(url);
    window.open(url,'_blank','noopener,noreferrer');
  }
  return <form className="contact-form" onSubmit={submit}>
    <h2>Conte sobre o seu projeto</h2>
    <div className="form-row"><div><label htmlFor="contact-name">Seu nome</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100}/></div><div><label htmlFor="contact-company">Empresa <span className="optional-field">(opcional)</span></label><input id="contact-company" name="company" autoComplete="organization" maxLength={150}/></div></div>
    <label htmlFor="contact-solution">Solução de interesse</label><select id="contact-solution" name="solution" value={solution} onChange={event=>setSolution(event.target.value)}><option value="">Ainda não sei qual solução escolher</option>{solutions.map(item=><option key={item.slug} value={item.slug}>{item.name}</option>)}</select>
    <label htmlFor="contact-message">O que sua empresa precisa?</label><textarea id="contact-message" name="message" rows={4} placeholder="Conte o objetivo, o público e os materiais que você já tem." required maxLength={2500}/>
    <button className="action" type="submit">Continuar no WhatsApp <ArrowUpRight size={19}/></button>
    {prepared && <p className="contact-feedback" role="status">Mensagem preparada. <a href={prepared} target="_blank" rel="noopener noreferrer">Abrir conversa no WhatsApp</a></p>}
    <p className="form-note">A mensagem será aberta no WhatsApp para você conferir e enviar. O site não armazena os dados deste formulário.</p>
  </form>;
}
