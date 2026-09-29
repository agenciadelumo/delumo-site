import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { Icon } from '@/components/brand';
import { ContactCTA } from '@/components/sections';

export const metadata: Metadata = {
  title: 'A Delumo',
  description: 'Equipe Delumo: gestão, treinamentos, marketing, tecnologia, gamificação e criação de experiências digitais.',
  alternates: { canonical: '/sobre' },
};

const team = [
  {
    name: 'Suélen da Veiga',
    text: 'Gestora e idealizadora da Delumo. Organiza projetos, define objetivos de aprendizagem e estrutura treinamentos conectados às necessidades de cada cliente.',
  },
  {
    name: 'Eduardo Vargas',
    text: 'Especializado em gamificação personalizada, manipulação e movimentos em Blender, interatividade e jogabilidade. Desenvolve mecânicas, animações e respostas do ambiente para experiências funcionais e envolventes.',
  },
  {
    name: 'Guto Luz',
    text: 'Formação superior em Marketing Digital e especialização em Engenharia de Front-End pela EBAC. Capacitações em metaverso, Unreal, Unity, 3DVista, SketchUp, V-Ray e Enscape.',
  },
];

export default function AboutPage() {
  return <main id="main" className="delumo-about-page">
    <section className="inner-hero"><div className="container"><p className="eyebrow">A DELUMO</p><h1>Pessoas que conectam<br/>conhecimento e tecnologia.</h1><p>Equipe Delumo. Gestão, criação e desenvolvimento para transformar desafios reais em soluções digitais.</p></div></section>
    <section className="section sa-about-section"><div className="container">
      <div className="team-heading about-team-heading"><p className="eyebrow">EQUIPE DELUMO</p><h2>Gestão, criação e tecnologia.<br/><em>Um projeto construído junto.</em></h2><p>Profissionais com experiências complementares conectam as necessidades do cliente ao conteúdo, à experiência e à tecnologia de cada projeto.</p></div>
      <div className="team-profiles">{team.map(member => <article className="team-profile" key={member.name}><h3>{member.name}</h3><p>{member.text}</p></article>)}</div>
      <a className="text-link" href="/contato">Converse com a Equipe Delumo <ArrowUpRight size={18}/></a>
    </div></section>
    <section className="section delumo-team"><div className="container"><div className="team-heading"><p className="eyebrow">COMPETÊNCIAS COMPLEMENTARES</p><h2>Diferentes especialidades.<br/><em>A solução adequada a cada desafio.</em></h2><p>A Equipe Delumo combina conhecimento técnico, visão de negócio e criação conforme as necessidades de cada projeto.</p></div>
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
