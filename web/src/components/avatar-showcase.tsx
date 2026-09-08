'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { ArrowLeft, ArrowRight, Check, Pause, Play } from 'lucide-react';
import { useMotion } from './motion';

const avatars = [
  ['avatar-para-baterias-vrla.webp', 'Avatar para Baterias VRLA'],
  ['avatar-para-baterias-brutus.webp', 'Avatar para Baterias Brutus'],
  ['avatar-para-treinamentos-administrativos.webp', 'Avatar para Treinamentos Administrativos'],
  ['avatar-para-baterias-de-carrinhos-de-golf.webp', 'Avatar para Baterias de Carrinhos de Golf'],
  ['avatar-para-garantia-de-baterias.webp', 'Avatar para Garantia de Baterias'],
  ['avatar-para-baterias-de-motos.webp', 'Avatar para Baterias de Motos'],
  ['avatar-para-baterias-nauticas.webp', 'Avatar para Baterias Náuticas'],
  ['avatar-para-baterias-estacionarias.webp', 'Avatar para Baterias Estacionárias'],
  ['avatar-para-baterias-pesadas-agricolas.webp', 'Avatar para Baterias Pesadas Agrícolas'],
  ['avatar-para-baterias-pesadas-para-caminhao.webp', 'Avatar para Baterias Pesadas para Caminhão'],
  ['avatar-para-baterias-tracionarias.webp', 'Avatar para Baterias Tracionárias'],
] as const;

const capabilities = [
  'Personalização de cada detalhe do fundo e do cenário.',
  'Personalização do avatar: uniforme, equipamentos e acessórios.',
  'Trilha sonora e locução conforme as especificações do cliente, com voz e sotaque personalizados.',
  'Aulas técnicas em que produtos e serviços podem ser apresentados e manuseados.',
];

export function AvatarShowcase() {
  const { paused: motionPaused } = useMotion();
  const [manualPaused, setManualPaused] = useState(false);
  const [active, setActive] = useState(0);
  const swiper = useRef<SwiperInstance | null>(null);
  const stopped = motionPaused || manualPaused;

  useEffect(() => {
    if (!swiper.current) return;
    if (stopped) swiper.current.autoplay?.stop(); else swiper.current.autoplay?.start();
  }, [stopped]);

  return <section className="avatar-showcase" id="avatares-personalizados" aria-labelledby="avatar-showcase-title"><div className="container">
    <div className="avatar-showcase-heading"><div><p className="eyebrow">DO CONTEÚDO À PRESENÇA DIGITAL</p><h2 id="avatar-showcase-title">Avatares personalizados</h2></div><p>O mesmo apresentador pode acompanhar diferentes assuntos e situações, preservando a linguagem, a identidade visual e o contexto de cada treinamento.</p></div>
    <div className="avatar-stage">
      <Swiper modules={[Autoplay]} slidesPerView={1} loop speed={650} autoplay={stopped ? false : { delay: 3000, disableOnInteraction: false }} onSwiper={instance => { swiper.current = instance; }} onRealIndexChange={instance => setActive(instance.realIndex)} aria-live={stopped ? 'polite' : 'off'}>
        {avatars.map(([file, title], index) => <SwiperSlide key={file}><figure aria-hidden={active !== index}><img src={`/media/avatares/${file}`} alt={title} width="1600" height="900" loading={index < 2 ? 'eager' : 'lazy'}/><figcaption>{title}</figcaption></figure></SwiperSlide>)}
      </Swiper>
      <div className="avatar-controls"><button className="avatar-control" onClick={() => swiper.current?.slidePrev()} aria-label="Avatar anterior" title="Anterior"><ArrowLeft size={20}/></button><span aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(avatars.length).padStart(2, '0')}</span><button className="avatar-control" disabled={motionPaused} onClick={() => setManualPaused(value => !value)} aria-label={motionPaused ? 'Animações pausadas no controle do site' : manualPaused ? 'Continuar apresentação de avatares' : 'Pausar apresentação de avatares'} title={motionPaused ? 'Animações pausadas no site' : manualPaused ? 'Continuar' : 'Pausar'}>{stopped ? <Play size={19}/> : <Pause size={19}/>}</button><button className="avatar-control" onClick={() => swiper.current?.slideNext()} aria-label="Próximo avatar" title="Próximo"><ArrowRight size={20}/></button></div>
    </div>
    <ul className="avatar-capabilities">{capabilities.map(item => <li key={item}><span><Check size={17}/></span><p>{item}</p></li>)}</ul>
  </div></section>;
}
