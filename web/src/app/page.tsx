import HeroCarousel from '@/components/hero';
import { TextSliderArea } from '@/components/interactive';
import { ClientLogos, ContactCTA, FAQ, FeaturedProjects, HRBanner, PlatformsSection, ProcessSection, Services, TrainingSection, WebsiteCases } from '@/components/sections';

export default function Home() {
  return <main id="main" className="home-page">
    <HeroCarousel/>
    <TextSliderArea/>
    <Services/>
    <ClientLogos/>
    <TrainingSection/>
    <HRBanner/>
    <PlatformsSection/>
    <FeaturedProjects compact/>
    <WebsiteCases compact/>
    <ProcessSection/><FAQ/><ContactCTA/>
  </main>;
}
