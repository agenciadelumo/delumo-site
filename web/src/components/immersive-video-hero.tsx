import { ArrowDown, ArrowUpRight, ChevronRight } from 'lucide-react';

const videoId = '-C6du1R1xyg';

export default function ImmersiveVideoHero({ title, intro }: { title: string; intro: string }) {
  return <section className="immersive-video-hero" aria-labelledby="immersive-title">
    <img className="immersive-video-poster" src="/media/metatrade-video.webp" alt="" width="1280" height="720"/>
    <iframe className="immersive-video-frame" src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`} title="Experiência imersiva MetaTrade em reprodução automática, sem som" allow="autoplay; encrypted-media; picture-in-picture" aria-hidden="true" tabIndex={-1}/>
    <div className="immersive-video-film"/>
    <div className="container immersive-video-content">
      <nav className="breadcrumbs" aria-label="Caminho de navegação"><a href="/">Início</a><ChevronRight size={14}/><a href="/#solucoes">Soluções</a><ChevronRight size={14}/><span aria-current="page">{title}</span></nav>
      <p className="eyebrow">AMBIENTES 3D E EXPERIÊNCIAS INTERATIVAS</p>
      <h1 id="immersive-title">{title}</h1><p>{intro}</p>
      <div className="immersive-video-actions"><a className="action" href={`https://youtu.be/${videoId}`} target="_blank" rel="noopener noreferrer">Assistir vídeo completo com som <ArrowUpRight size={18}/></a><a href="#aplicacoes">Ver aplicações <ArrowDown size={17}/></a></div>
    </div>
  </section>;
}
