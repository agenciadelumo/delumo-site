import { ArrowUpRight, Route, Sparkles, UserRoundCheck } from 'lucide-react';

export function AprenderBanner() {
  return <section className="aprender-band" aria-labelledby="aprender-title"><div className="container">
    <div className="aprender-band-heading"><div><p className="eyebrow">CONHECIMENTO COM DIREÇÃO</p><h2 id="aprender-title">Delumo Aprender</h2><p>Sua próxima experiência de aprendizagem começa com uma conversa.</p></div><a href="/treinador" className="aprender-band-action">Planejar um treinamento <ArrowUpRight size={20}/></a></div>
    <div className="aprender-benefits"><article><Route size={26}/><h3>Um passo de cada vez.</h3><p>Defina o objetivo, reúna o conteúdo e organize um percurso para sua equipe ou escola.</p></article><article><Sparkles size={26}/><h3>IA com propósito.</h3><p>Assistência ao planejamento, mediante ativação. Sugestões sempre passam pela sua revisão.</p></article><article><UserRoundCheck size={26}/><h3>A experiência certa.</h3><p>Planeje trilhas, vídeos com avatares e imersão. A produção é desenvolvida conforme cada projeto.</p></article></div>
  </div></section>;
}
