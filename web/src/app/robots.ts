import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/'},sitemap:'https://www.delumo.com.br/sitemap.xml',host:'https://www.delumo.com.br'};}
