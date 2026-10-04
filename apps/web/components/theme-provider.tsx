'use client';
import {createContext,useContext,useEffect,useState} from 'react'; import type {Theme} from '@estara/types';
const C=createContext<{theme:Theme;setTheme:(t:Theme)=>void}>({theme:'system',setTheme:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){const [theme,setTheme]=useState<Theme>('system'); useEffect(()=>{const t=(localStorage.getItem('estara-theme') as Theme)||'system'; setTheme(t)},[]); useEffect(()=>{localStorage.setItem('estara-theme',theme); const root=document.documentElement; if(theme==='system'){const dark=matchMedia('(prefers-color-scheme: dark)').matches; root.dataset.theme=dark?'dark':'light'}else root.dataset.theme=theme},[theme]); return <C.Provider value={{theme,setTheme}}>{children}</C.Provider>}
export const useTheme=()=>useContext(C);
