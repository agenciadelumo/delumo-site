import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import Header, { WhatsAppFloating } from '@/components/navigation';
import { MotionProvider } from '@/components/motion';
import { Footer } from '@/components/sections';
import 'swiper/css';
import './globals.css';
import './hero.css';
import './experience.css';

const display = Bricolage_Grotesque({subsets:['latin'],variable:'--font-display',display:'swap'});
const body = Figtree({subsets:['latin'],variable:'--font-body',display:'swap'});
export const metadata: Metadata = {
  metadataBase: new URL('https://www.delumo.com.br'),
  title: {default:'Delumo | Treinamentos, gamificação e soluções digitais',template:'%s | Delumo'},
  description:'Treinamentos e trilhas de conhecimento, gamificação, projetos 3D, plataformas inteligentes e experiências imersivas. Conhecimento e tecnologia para desenvolver pessoas e negócios.',
  alternates:{canonical:'/'},
  openGraph:{type:'website',locale:'pt_BR',siteName:'Delumo'},
  icons:{icon:'/assets/img/favicon.svg',apple:'/assets/img/apple-touch-icon.png'},
  robots:{index:true,follow:true},
};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {
  return <html lang="pt-BR" className={`${display.variable} ${body.variable}`}><body id="top"><MotionProvider><Header/>{children}<Footer/><WhatsAppFloating/></MotionProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'Delumo',url:'https://www.delumo.com.br',logo:'https://www.delumo.com.br/assets/img/apple-touch-icon.png',email:'agenciadelumo@gmail.com',telephone:'+5554981302517',description:'Soluções digitais para desenvolver pessoas e conectar negócios.',address:{'@type':'PostalAddress',streetAddress:'Rua Anita Garibaldi, 1473, Bela Vista',addressLocality:'Erechim',addressRegion:'RS',addressCountry:'BR'},areaServed:'BR'})}}/></body></html>;
}
