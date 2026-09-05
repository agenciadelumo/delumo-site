import { ArrowUpRight, ArrowRight, GraduationCap, Gamepad2, Box, PanelsTopLeft, ScanEye, Users, Target, MessagesSquare, Workflow, RefreshCw, Layers, Timer, Puzzle, ChartNoAxesCombined, BrainCircuit, Monitor, Gauge, Search, Network, CircleCheck } from 'lucide-react';
import type { ReactNode } from 'react';

const icons = { GraduationCap, Gamepad2, Box, PanelsTopLeft, ScanEye, Users, Target, MessagesSquare, Workflow, RefreshCw, Layers, Timer, Puzzle, ChartNoAxesCombined, BrainCircuit, Monitor, Gauge, Search, Network, CircleCheck };
export function Icon({ name, size = 28 }: { name: string; size?: number }) {
  const Component = icons[name as keyof typeof icons] || Box;
  return <Component size={size} strokeWidth={1.5} aria-hidden="true" />;
}

// Original Delumo wordmark and ring geometry from the existing site.
export function Logo({ className = '' }: { className?: string }) {
  return <span className={`delumo-logo ${className}`} role="img" aria-label="Delumo">delum<svg viewBox="-36 -36 72 72" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true"><circle className="ring ring-one" r="27" strokeWidth="8" strokeDasharray="80 14 60 15.6" transform="rotate(35)" /><circle className="ring ring-two" r="15.5" strokeWidth="7" strokeDasharray="45 12 28 12.4" transform="rotate(190)" /><circle r="5" strokeWidth="6" strokeDasharray="22 9.4" transform="rotate(80)" /></svg></span>;
}

export function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.2c1.5.8 3.1 1.2 4.7 1.2 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm5.9 16.9c-.3.8-1.5 1.5-2.4 1.7-.6.1-1.4.2-4.1-.9-3.4-1.4-5.6-4.9-5.8-5.1-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.8.6.3.8 1 2.6 1.1 2.8.1.2.2.4 0 .7-.1.3-.2.4-.4.7l-.6.7c-.2.2-.4.4-.2.8.2.4 1 1.7 2.2 2.7 1.5 1.4 2.8 1.8 3.2 2 .4.2.6.2.9-.1.2-.3 1-1.2 1.3-1.6.3-.4.5-.3.9-.2.4.1 2.4 1.1 2.8 1.3.4.2.7.3.8.5.1.2.1 1-.2 1.8z" /></svg>;
}

export function Action({ href, children, secondary = false, external = false, className = '' }: { href: string; children: ReactNode; secondary?: boolean; external?: boolean; className?: string }) {
  return <a className={`action tp-btn-anim ${secondary ? 'secondary' : ''} ${className}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><span className="tp-btn-text">{children}</span>{external ? <ArrowUpRight size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}</a>;
}

export function SectionHeading({ label, title, children, light = false }: { label: string; title: ReactNode; children?: ReactNode; light?: boolean }) {
  return <div className={`section-heading ${light ? 'on-dark' : ''}`}><div><p className="eyebrow"><span />{label}</p><h2>{title}</h2></div>{children && <div className="section-intro">{children}</div>}</div>;
}
