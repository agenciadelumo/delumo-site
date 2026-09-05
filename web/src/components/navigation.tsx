'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo, WhatsAppIcon } from './brand';
import { MotionToggle } from './motion';
import { contact } from '@/data/content';

const navigation = [['A Delumo','/sobre'],['Soluções','/#solucoes'],['Treinamentos','/solucoes/treinamentos'],['Gamificação','/projetos']];
export default function Header() {
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const pathname=usePathname();
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>40);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
  useEffect(()=>{setOpen(false);},[pathname]);
  useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close(); const old=document.body.style.overflow;if(open)document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;};},[open]);
  return <>
    <a className="skip-link" href="#main">Ir para o conteúdo</a>
    <header className={`site-header ${scrolled || pathname !== '/' ? 'is-scrolled' : ''}`}><div className="container header-inner">
      <a href="/" className="brand-link" aria-label="Delumo, início"><Logo /></a>
      <nav className="desktop-nav" aria-label="Navegação principal">{navigation.map(([name,href])=><a key={name} href={href} aria-current={pathname===href ? 'page' : undefined}>{name}</a>)}</nav>
      <div className="header-actions"><MotionToggle /><a href="/contato" className="header-contact">Vamos conversar <ArrowUpRight size={17} aria-hidden="true" /></a><button className="icon-button mobile-menu-button" onClick={()=>setOpen(true)} aria-label="Abrir menu" aria-expanded={open}><Menu size={24}/></button></div>
    </div></header>
    <dialog className="nav-dialog" ref={dialog} aria-label="Menu principal" onCancel={()=>setOpen(false)} onClick={event=>{if(event.target===dialog.current)setOpen(false);}}><div className="nav-dialog-inner"><div className="nav-dialog-top"><a href="/" onClick={()=>setOpen(false)} aria-label="Delumo, início"><Logo /></a><button className="icon-button" onClick={()=>setOpen(false)} aria-label="Fechar menu"><X/></button></div><nav aria-label="Navegação móvel">{[...navigation,['Contato','/contato']].map(([name,href],i)=><a href={href} key={name} aria-current={pathname===href ? 'page' : undefined} onClick={()=>setOpen(false)}><small aria-hidden="true">0{i+1}</small>{name}<ArrowUpRight/></a>)}</nav><a className="mobile-phone" href={contact.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/><span>{contact.name}<br/>{contact.phone}</span></a></div></dialog>
  </>;
}

export function WhatsAppFloating() {
  return <a href={contact.whatsapp} className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Falar com Guto da Luz no WhatsApp: (54) 98130-2517"><span className="whatsapp-label">Fale com Guto da Luz<small>{contact.phone}</small></span><WhatsAppIcon/></a>;
}
