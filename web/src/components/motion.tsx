'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Pause, Play } from 'lucide-react';

const MotionContext = createContext({ paused: false, toggle: () => {} });
export const useMotion = () => useContext(MotionContext);
export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPaused(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused) return;
    gsap.registerPlugin(ScrollTrigger);
    // Scoped adaptation of Acjon's fadeAnimation; content remains readable without JS.
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.tp_fade_anim').forEach(item => {
        gsap.from(item, { opacity: 0, y: 24, duration: .65, ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 96%', once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, [paused, pathname]);
  return <MotionContext.Provider value={{ paused, toggle: () => setPaused(value => !value) }}><div ref={root} data-motion={paused ? 'paused' : 'running'}>{children}</div></MotionContext.Provider>;
}
export function MotionToggle() {
  const { paused, toggle } = useMotion();
  return <button className="icon-button motion-toggle" onClick={toggle} aria-label={paused ? 'Ativar animações' : 'Pausar animações'} title={paused ? 'Ativar animações' : 'Pausar animações'}>{paused ? <Play size={18} /> : <Pause size={18} />}</button>;
}
