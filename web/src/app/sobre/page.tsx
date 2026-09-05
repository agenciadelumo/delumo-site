import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { Action, Icon } from '@/components/brand';
import { ContactCTA } from '@/components/sections';

export const metadata: Metadata = { title: 'A Delumo', description: 'Guto da Luz e Time Delumo: experiência em marketing, vendas, tecnologia e criação de treinamentos, games e ambientes imersivos.', alternates: { canonical: '/sobre' } };

export default function AboutPage() {
  return <main id="main" className="delumo-about-page">
    <section className="inner-hero"><div className="container"><p className="eyebrow">A DELUMO</p><h1>Pessoas que conectam<br/>conhecimento e tecnologia.</h1><p>Guto da Luz e Time Delumo. Estratégia, criação e desenvolvimento para transformar desafios reais em soluções digitais.</p></div></section>
    <section className="section sa-about-section"><div className="container">
      <div className="sa-about-heading"><p className="eyebrow">QUEM SOU</p><h2>Guto da Luz.<br/><em>Visão de negócio.<br/>Vontade de construir.</em></h2></div>
      <div className="sa-about-layout">
        <figure className="about-image about-portrait founder-portrait"><div className="portrait-frame" tabIndex={0} aria-label="Retrato de Guto da Luz"><img src="/media/antonio-augusto-da-luz.png" alt="Guto da Luz, da Delumo" width="640" height="640"/></div><figcaption><strong>Guto da Luz</strong><span>Estratégia e desenvolvimento de soluções digitais</span></figcaption></figure>
        <div className="founder-copy"><p className="founder-lead">Minha experiência nasceu perto de quem vende, atende e faz a operação acontecer.</p><p>Desde 2008, atuo em vendas e marketing, com experiência em gestão comercial, estratégias B2B e B2C, trade marketing, liderança de equipes e projetos digitais. Essa vivência ajuda a conectar o que uma empresa precisa comunicar ao que suas pessoas precisam aprender e executar.</p><p>Na Delumo, reúno essa visão de negócio ao desenvolvimento de treinamentos, plataformas, gamificação e experiências imersivas. Participo da concepção e condução dos projetos, conectando especialistas de diferentes áreas para construir a solução adequada a cada desafio.</p>
          <div className="founder-education"><h3>Formação e desenvolvimento</h3><p>Formação superior em Marketing Digital e especialização em desenvolvimento front-end. Capacitações em Empretec, atendimento ao cliente, marketing de serviços, implantação de CRM e gestão de vendas e pós-venda.</p></div>
          <Action href="/contato">Converse com Guto da Luz</Action>
        </div>
      </div>
    </div></section>
    <section className="section delumo-team"><div className="container"><div className="team-heading"><p className="eyebrow">TIME DELUMO</p><h2>Diferentes especialidades.<br/><em>Um projeto construído junto.</em></h2><p>Nossa equipe reúne profissionais de áreas complementares. Guto da Luz conecta a estratégia às entregas, e o time combina conhecimento técnico e criação conforme as necessidades de cada projeto.</p></div>
      <div className="team-disciplines">{[
        ['Code2', 'Engenharia de software', 'Sites, plataformas, integrações via API e soluções digitais com arquitetura e recursos definidos para a operação.'],
        ['Box', 'Design 3D', 'Modelagem, materiais, iluminação e visualização de produtos e ambientes para explicar e explorar.'],
        ['Building2', 'Arquitetura e espaços', 'Leitura espacial, organização dos ambientes e representação dos contextos em que a experiência acontece.'],
        ['Gamepad2', 'Desenvolvimento de games', 'Mecânicas, interações e experiências em Unity e outras ferramentas escolhidas para o objetivo e os dispositivos do projeto.'],
      ].map(([icon, title, text]) => <article key={title}><Icon name={icon} size={32}/><h3>{title}</h3><p>{text}</p></article>)}</div>
      <a className="text-link" href="/#solucoes">Conheça as soluções da Delumo <ArrowUpRight size={18}/></a>
    </div></section><ContactCTA/>
  </main>;
}
