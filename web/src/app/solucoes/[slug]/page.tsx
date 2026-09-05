import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { Action } from '@/components/brand';
import { ContactCTA } from '@/components/sections';
import { VideoPlayer } from '@/components/interactive';
import TrainingDetail from '@/components/training-detail';
import { solutions } from '@/data/content';

export const dynamicParams = false;
export function generateStaticParams(){return solutions.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const item=solutions.find(solution=>solution.slug===slug);
  return item?{title:item.name,description:`${item.short} ${item.intro}`,alternates:{canonical:`/solucoes/${slug}`}}:{};
}

const related: Record<string,string[]> = {
  treinamentos:['imersao','plataformas'], rh:['treinamentos','plataformas'],
  gamificacao:['treinamentos','plataformas'], plataformas:['treinamentos','gamificacao'],
  'projetos-3d':['imersao','treinamentos'], imersao:['gamificacao','treinamentos'],
};

export default async function SolutionPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const item=solutions.find(solution=>solution.slug===slug);
  if(!item)notFound();
  if(slug==='treinamentos')return <TrainingDetail/>;
  return <main id="main">
    <section className="inner-hero"><div className="container">
      <nav className="breadcrumbs" aria-label="Caminho de navegação"><a href="/">Início</a><ChevronRight size={14}/><a href="/#solucoes">Soluções</a><ChevronRight size={14}/><span aria-current="page">{item.name}</span></nav>
      <h1>{item.name}</h1><p>{item.intro}</p>
      <nav className="solution-jumps" aria-label="Nesta solução"><a href="#aplicacoes">Aplicações <ArrowDown size={15}/></a><a href="#entregas">O que entregamos <ArrowDown size={15}/></a></nav>
    </div></section>
    {['projetos-3d','imersao'].includes(slug) && <section className="immersive-showreel" aria-label="Vídeo de capa MetaTrade"><VideoPlayer id="-C6du1R1xyg" poster="/media/metatrade-video.webp" title="MetaTrade: treinamento em ambientes 3D"/></section>}
    <section className="section solution-detail"><div className="container">
      {slug==='projetos-3d' && <p className="solution-family">Projetos especiais 3D fazem parte de <a href="/solucoes/imersao">Experiências imersivas <ArrowUpRight size={16}/></a>.</p>}
      {slug==='rh' && <p className="solution-family">Soluções para RH fazem parte de <a href="/solucoes/treinamentos#rh">Treinamentos e trilhas <ArrowUpRight size={16}/></a>.</p>}
      <div className="solution-intro"><img src={item.image} alt={item.imageAlt} width="1000" height="750"/><div className="solution-copy"><h2>Como ajudamos sua empresa</h2><p className="solution-summary">{item.short}</p><p>{item.description}</p><Action href={`/contato?solucao=${item.slug}`}>Conversar sobre {item.slug==='rh'?'RH':'esta solução'}</Action></div></div>
      <div className="solution-list-grid"><article className="solution-list" id="aplicacoes"><h3>Onde pode ser aplicada</h3><ul>{item.applications.map(text=><li key={text}>{text}</li>)}</ul></article><article className="solution-list" id="entregas"><h3>O que podemos desenvolver</h3><ul>{item.deliverables.map(text=><li key={text}>{text}</li>)}</ul></article></div>
      <div className="solution-outcome"><Check size={26}/>{item.outcome}</div>
      <div className="related-solutions"><h2>Soluções que podem complementar</h2><nav aria-label="Soluções relacionadas">{solutions.filter(solution=>related[slug]?.includes(solution.slug)).map(solution=><a key={solution.slug} href={`/solucoes/${solution.slug}`}>{solution.name}<ArrowUpRight size={18}/></a>)}</nav></div>
    </div></section><ContactCTA/>
  </main>;
}
