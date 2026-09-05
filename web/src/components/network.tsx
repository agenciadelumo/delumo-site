'use client';

import { useEffect, useRef } from 'react';
import { geoMercator, geoPath, geoInterpolate, type GeoPermissibleObjects } from 'd3-geo';
import countries from '@/data/south-america.json';
import states from '@/data/brazil-states.json';
import { useMotion } from './motion';

const cities: { name: string; point: [number, number] }[] = [
  { name: 'Erechim', point: [-51.17, -27.64] },
  { name: 'Porto Alegre', point: [-51.22, -30.03] },
  { name: 'Florianópolis', point: [-48.55, -27.59] },
  { name: 'Curitiba', point: [-49.27, -25.43] },
  { name: 'São Paulo', point: [-46.63, -23.55] },
  { name: 'Rio de Janeiro', point: [-43.17, -22.91] },
  { name: 'Belo Horizonte', point: [-43.94, -19.92] },
  { name: 'Brasília', point: [-47.88, -15.79] },
  { name: 'Goiânia', point: [-49.26, -16.68] },
  { name: 'Cuiabá', point: [-56.10, -15.60] },
  { name: 'Campo Grande', point: [-54.62, -20.44] },
  { name: 'Salvador', point: [-38.50, -12.97] },
  { name: 'Recife', point: [-34.90, -8.05] },
  { name: 'Fortaleza', point: [-38.52, -3.73] },
  { name: 'Belém', point: [-48.49, -1.45] },
  { name: 'Manaus', point: [-60.02, -3.12] },
  { name: 'Porto Velho', point: [-63.90, -8.76] },
];
const connections = [[0,1],[0,2],[2,3],[3,4],[4,5],[4,6],[6,7],[7,8],[8,9],[9,10],[10,0],[6,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,9],[9,7]];

export default function NetworkCanvas({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const clock = useRef(0);
  const { paused } = useMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const base = document.createElement('canvas');
    const baseContext = base.getContext('2d');
    if (!baseContext) return;
    let width = 0, height = 0, frame = 0, last = 0, visible = true;
    const projection = geoMercator();
    const paths = connections.map(([a,b]) => {
      const interpolate = geoInterpolate(cities[a].point, cities[b].point);
      return Array.from({length: 41}, (_,i) => interpolate(i/40));
    });
    const resize = () => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = base.width = Math.round(width*dpr);
      canvas.height = base.height = Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      baseContext.setTransform(dpr,0,0,dpr,0,0);
      // Geographic coordinates and local Natural Earth data keep the full-bleed map independent of tile services.
      projection.center([-53, -17]).scale(width < 700 ? width*1.32 : width*1.12).translate([width*.53,height*.48]);
      const path = geoPath(projection, baseContext);
      baseContext.fillStyle = '#080b0b'; baseContext.fillRect(0,0,width,height);
      countries.features.forEach(country => {
        baseContext.beginPath(); path(country as GeoPermissibleObjects);
        baseContext.fillStyle = country.properties.name === 'Brazil' ? '#202724' : '#131817';
        baseContext.fill(); baseContext.strokeStyle = '#3a4440'; baseContext.lineWidth = .8; baseContext.stroke();
      });
      states.features.forEach(state => {
        baseContext.beginPath(); path(state as GeoPermissibleObjects);
        baseContext.strokeStyle = '#505b54'; baseContext.lineWidth = .65; baseContext.stroke();
      });
      baseContext.strokeStyle = 'rgba(147,220,106,.18)'; baseContext.lineWidth = 1;
      paths.forEach(points => {baseContext.beginPath(); points.forEach((p,i) => {const [x,y]=projection(p as [number,number])!; if(i)baseContext.lineTo(x,y);else baseContext.moveTo(x,y);});baseContext.stroke();});
    };
    const draw = (now: number) => {
      if (last && !paused && active && visible && !document.hidden) clock.current += Math.min(now-last, 80);
      last = now;
      ctx.clearRect(0,0,width,height); ctx.drawImage(base,0,0,width,height);
      // Concurrent paths keep movement visible throughout the cover.
      paths.forEach((points,index) => {
        const progress = ((clock.current/2300 + index*.23)%1);
        const end = Math.max(1,Math.floor(progress*40));
        ctx.beginPath(); points.slice(0,end+1).forEach((p,i)=>{const [x,y]=projection(p as [number,number])!;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});
        ctx.strokeStyle='rgba(151,245,42,.67)';ctx.lineWidth=1.5;ctx.stroke();
        const [x,y]=projection(points[end] as [number,number])!;
        ctx.beginPath();ctx.arc(x,y,2.8,0,Math.PI*2);ctx.fillStyle='#b1ff30';ctx.shadowColor='#a8ff0a';ctx.shadowBlur=9;ctx.fill();ctx.shadowBlur=0;
      });
      cities.forEach(({name,point},index) => {
        const [x,y]=projection(point)!;
        ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fillStyle='#b4ff50';ctx.fill();
        ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.strokeStyle='rgba(168,255,10,.32)';ctx.stroke();
        if(width>700 || [0,4,7,11,15].includes(index)) {
          ctx.font='500 11px Arial';ctx.textAlign='left';ctx.lineWidth=3;ctx.strokeStyle='#111916';
          ctx.strokeText(name,x+11,y-9);ctx.fillStyle='#bdc9c1';ctx.fillText(name,x+11,y-9);
        }
      });
      if (!paused && active && visible && !document.hidden) frame=requestAnimationFrame(draw);
    };
    const restart = () => {cancelAnimationFrame(frame);last=0;draw(performance.now());};
    const observer=new ResizeObserver(()=>{resize();restart();});observer.observe(canvas);
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;restart();});intersection.observe(canvas);
    document.addEventListener('visibilitychange',restart);
    resize();restart();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',restart);};
  },[paused,active]);
  return <canvas className="full-map" ref={ref} role="img" aria-label="Mapa geográfico do Brasil com os estados e conexões animadas entre cidades"/>;
}
