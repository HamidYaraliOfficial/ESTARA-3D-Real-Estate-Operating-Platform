'use client';
import {useEffect,useState} from 'react';
export function ReducedMotionNotice(){const [reduced,setReduced]=useState(false);useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const read=()=>setReduced(q.matches);read();q.addEventListener('change',read);return()=>q.removeEventListener('change',read)},[]);if(!reduced)return null;return <div className="fixed left-4 top-20 z-40 rounded-xl border bg-white/90 px-3 py-2 text-xs shadow-lg dark:bg-slate-900/90">Reduced motion enabled</div>}
