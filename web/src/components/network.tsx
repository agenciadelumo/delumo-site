'use client';
import { useEffect, useRef } from 'react';
import brazil from '@/data/brazil.json';
import { useMotion } from './motion';

const cities = [[-51.17,-27.64],[-51.22,-30.03],[-48.55,-27.59],[-49.27,-25.43],[-46.63,-23.55],[-43.17,-22.91],[-43.94,-19.92],[-47.88,-15.79],[-49.26,-16.68],[-56.10,-15.60],[-54.62,-20.44],[-38.50,-12.97],[-34.90,-8.05],[-38.52,-3.73],[-48.49,-1.45],[-60.02,-3.12],[-63.90,-8.76],[-44.30,-2.53],[-42.80,-5.09],[-35.20,-5.80]];
const edges = [[0,1],[0,2],[2,3],[3,4],[4,5],[4,6],[6,7],[7,8],[8,9],[3,10],[10,9],[6,11],[11,12],[12,19],[19,13],[13,18],[18,17],[17,14],[14,15],[15,16],[16,9],[14,7],[7,11],[9,15]];

export default function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0, width = 0, height = 0, active = true, time = 0, last = 0;
    const resize = () => { width = canvas.clientWidth; height = canvas.clientHeight; const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = width*dpr; canvas.height = height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    const project = ([lon,lat]: number[]) => {
      const scale = Math.min(width*.54/40, height*.85/40);
      const centerX = width < 760 ? width*.56 : width*.74;
      return [centerX+(lon+53.7)*scale, height*.47+(-lat-14.5)*scale];
    };
    const draw = (stamp: number) => {
      if (!width || !height) resize();
      if (last && !paused && active) time += Math.min(stamp-last, 70);
      last=stamp;
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle='#071710'; ctx.fillRect(0,0,width,height);
      // Natural Earth country geometry keeps the map geographically recognizable.
      const rings = brazil.type === 'Polygon' ? brazil.coordinates as number[][][] : (brazil.coordinates as unknown as number[][][][]).flat();
      const outline = new Path2D();
      rings.forEach(ring => { ring.forEach((point,index)=>{const [x,y]=project(point); if(index===0)outline.moveTo(x,y); else outline.lineTo(x,y);}); outline.closePath(); });
      ctx.fillStyle='#0c281c'; ctx.fill(outline); ctx.strokeStyle='rgba(130,185,151,.32)'; ctx.lineWidth=1.2; ctx.stroke(outline);
      ctx.save(); ctx.clip(outline);
      for(let x=0;x<width;x+=13) for(let y=0;y<height;y+=13){ctx.fillStyle='rgba(147,201,169,.19)';ctx.fillRect(x,y,1.2,1.2);}
      ctx.restore();
      const cycle=(time%18500)/18500;
      const touched = new Set<number>([0]);
      const position=cycle*(edges.length+6);
      edges.forEach(([from,to],index)=>{
        const a=project(cities[from]), b=project(cities[to]);
        ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle='rgba(166,243,76,.11)';ctx.lineWidth=1;ctx.stroke();
        const progress=Math.max(0,Math.min(1,position-index));
        if(progress>0){
          const x=a[0]+(b[0]-a[0])*progress,y=a[1]+(b[1]-a[1])*progress;
          ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(x,y);ctx.strokeStyle='rgba(171,246,64,.7)';ctx.lineWidth=1.35;ctx.stroke();
          if(progress<1){ctx.beginPath();ctx.arc(x,y,3.8,0,Math.PI*2);ctx.fillStyle='#bcff53';ctx.shadowBlur=12;ctx.shadowColor='#b4f428';ctx.fill();ctx.shadowBlur=0;}
          touched.add(from);if(progress===1)touched.add(to);
        }
      });
      cities.forEach((point,index)=>{
        const [x,y]=project(point), lit=touched.has(index), color=lit?'#b4f428':'#ff767a';
        ctx.beginPath();ctx.arc(x,y,3.3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
        ctx.beginPath();ctx.arc(x,y,7.2+Math.sin(time/600+index)*1.2,0,Math.PI*2);ctx.strokeStyle=lit?'rgba(180,244,40,.3)':'rgba(255,110,120,.2)';ctx.lineWidth=1;ctx.stroke();
        if(width>680 || index%3===0){ctx.font='600 9px monospace';ctx.fillStyle=color;ctx.fillText('LEAD',x+9,y-9);}
      });
      ctx.strokeStyle='rgba(157,214,184,.055)';ctx.lineWidth=1;
      for(let i=0;i<7;i++){const y=height*.15+i*height*.12;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(width*.3,y-90,width*.6,y+120,width,y-50);ctx.stroke();}
      if (!paused && active) frame=requestAnimationFrame(draw);
    };
    const observer=new ResizeObserver(()=>{resize(); if(paused)draw(performance.now());});observer.observe(canvas);
    const visibility=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;cancelAnimationFrame(frame);last=0;if(active)frame=requestAnimationFrame(draw);});visibility.observe(canvas);
    const onVisibility=()=>{cancelAnimationFrame(frame);last=0;if(!document.hidden&&active)frame=requestAnimationFrame(draw);};document.addEventListener('visibilitychange',onVisibility);
    resize();draw(performance.now());
    return()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',onVisibility);};
  },[paused]);
  return <canvas className="hero-network" ref={ref} aria-hidden="true" />;
}
