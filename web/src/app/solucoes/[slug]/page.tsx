import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { Action } from '@/components/brand';
import { ContactCTA } from '@/components/sections';
import { solutions } from '@/data/content';

export const dynamicParams = false;
export function generateStaticParams(){return solutions.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const item=solutions.find(solution=>solution.slug===slug);return item?{title:item.name,description:item.description,alternates:{canonical:`/solucoes/${slug}`}}:{};}
export default async function SolutionPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=solutions.find(solution=>solution.slug===slug);if(!item)notFound();return <main id="main"><section className="inner-hero"><div className="container"><p className="eyebrow">SOLUÇÃO {item.number}</p><h1>{item.name}</h1><p>{item.intro}</p></div></section><section className="section solution-detail"><div className="container"><div className="solution-intro"><img src={item.image} alt={item.imageAlt} width="1000" height="750"/><div className="solution-copy"><p className="eyebrow">COMO ESSA SOLUÇÃO AJUDA</p><h2>{item.short}</h2><p>{item.description}</p><Action href="/contato">Converse sobre esta solução</Action></div></div><div className="solution-list-grid"><article className="solution-list"><h3>Onde pode ser aplicada</h3><ul>{item.applications.map(text=><li key={text}>{text}</li>)}</ul></article><article className="solution-list"><h3>O que podemos desenvolver</h3><ul>{item.deliverables.map(text=><li key={text}>{text}</li>)}</ul></article></div><div className="solution-outcome"><Check size={28}/>{item.outcome}</div></div></section><ContactCTA/></main>}
