import type {SearchFilters,PropertyCard,PropertyDetail,Lead,Appointment} from '@estara/types';
const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000/api';
async function req<T>(path:string,init?:RequestInit):Promise<T>{const res=await fetch(`${API}${path}`,{...init,headers:{'Content-Type':'application/json',...(init?.headers||{})},cache:'no-store'}); if(!res.ok) throw new Error(await res.text()); return res.json();}
export async function searchProperties(filters:SearchFilters={}){const qs=new URLSearchParams(); Object.entries(filters).forEach(([k,v])=>{if(v===undefined||v===null||v==='')return; if(Array.isArray(v))qs.set(k,v.join(',')); else qs.set(k,String(v))}); return req<{data:PropertyCard[];meta:any}>(`/properties?${qs}`)}
export const getProperty=(slug:string)=>req<PropertyDetail>(`/properties/${encodeURIComponent(slug)}`);
export const getLeads=()=>req<Lead[]>('/leads');
export const moveLead=(id:string,status:string)=>req(`/leads/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});
export const getAppointments=()=>req<Appointment[]>('/appointments');
export const getAvailability=(start:string)=>req<{slots:{start:string;end:string;minutes:number}[];nextOpening:string|null}>(`/appointments/availability?start=${encodeURIComponent(start)}&days=14`);
export const bookAppointment=(body:any)=>req('/appointments',{method:'POST',body:JSON.stringify(body)});
