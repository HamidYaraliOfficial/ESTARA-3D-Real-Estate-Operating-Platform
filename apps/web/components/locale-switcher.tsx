'use client';
import {usePathname,useRouter} from 'next/navigation'; import type {Locale} from '@estara/types';
export function LocaleSwitcher({locale}:{locale:Locale}){const path=usePathname();const router=useRouter();return <select value={locale} onChange={e=>router.push(path.replace(/^\/(en|fa|zh)/,`/${e.target.value}`))} className="rounded-xl border bg-transparent px-3 py-2 text-sm" style={{borderColor:'var(--border)'}}><option value="en">English</option><option value="fa">فارسی</option><option value="zh">中文</option></select>}
