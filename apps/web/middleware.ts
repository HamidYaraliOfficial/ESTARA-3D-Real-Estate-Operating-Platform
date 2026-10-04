import {NextRequest,NextResponse} from 'next/server'; const supported=['en','fa','zh'];
export function middleware(req:NextRequest){const p=req.nextUrl.pathname;if(p.startsWith('/_next')||p.startsWith('/api')||p.includes('.'))return NextResponse.next();const first=p.split('/')[1];if(!supported.includes(first)){const url=req.nextUrl.clone();url.pathname=`/en${p==='/'?'':p}`;return NextResponse.redirect(url)}return NextResponse.next();}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
