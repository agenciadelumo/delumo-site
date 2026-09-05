import { Action } from '@/components/brand';
import HeroCarousel from '@/components/hero';
import { TextSliderArea } from '@/components/interactive';
import { ClientLogos, ContactCTA, FAQ, FeaturedProjects, PlatformsSection, ProcessSection, Services, TrainingSection, TrainingVideos, WebsiteCases } from '@/components/sections';

export default function Home() {
  return <main id="main">
    <HeroCarousel/>
    <TextSliderArea/>
    <Services/>
    <ClientLogos/>
    <TrainingSection/>
    <PlatformsSection/>
    <FeaturedProjects/>
    <TrainingVideos/>
    <WebsiteCases/>
    <section className="about-teaser"><div className="container"><p className="eyebrow">MUITO ALÉM DE UM FORMATO</p><h2>A Delumo conecta<br/><span>quem aprende,</span><br/>quem cria e quem evolui.</h2><div><p>Somos uma empresa de soluções digitais. Unimos conteúdo, design e desenvolvimento para transformar conhecimento em experiências e tecnologia em ferramentas úteis para os negócios.</p><Action href="/sobre" secondary>Conheça a Delumo</Action></div></div></section>
    <ProcessSection/><FAQ/><ContactCTA/>
  </main>;
}
