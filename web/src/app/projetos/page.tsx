import type { Metadata } from 'next';
import { FeaturedProjects, WebsiteCases, ContactCTA } from '@/components/sections';
export const metadata:Metadata={title:'Projetos',description:'Conheça projetos de gamificação, experiências imersivas, treinamento, sites e plataformas desenvolvidos pela Delumo.',alternates:{canonical:'/projetos'}};
export default function ProjectsPage(){return <main id="main"><section className="inner-hero"><div className="container"><p className="eyebrow">PROJETOS DELUMO</p><h1>Estratégia que<br/><em>ganha vida.</em></h1><p>Games, ambientes imersivos, conteúdos e plataformas criados para desafios reais de empresas e equipes.</p></div></section><FeaturedProjects heading={false}/><WebsiteCases/><ContactCTA/></main>}
