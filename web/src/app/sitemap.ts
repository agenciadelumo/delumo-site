import type { MetadataRoute } from 'next';
import { solutions } from '@/data/content';
export const dynamic = 'force-static';
export default function sitemap():MetadataRoute.Sitemap{const base='https://www.delumo.com.br';return ['', '/sobre','/projetos','/contato','/privacidade',...solutions.map(item=>`/solucoes/${item.slug}`)].map((path,index)=>({url:`${base}${path}`,lastModified:new Date('2026-09-05'),changeFrequency:index===0?'weekly':'monthly',priority:index===0?1:.8}));}
