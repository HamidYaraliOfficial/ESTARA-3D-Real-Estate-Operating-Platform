import type { WorkingHours, WorkingDay } from '@estara/types';
const map: Record<number, WorkingDay> = {1:'MON',2:'TUE',3:'WED',4:'THU',5:'FRI',6:'SAT',0:'SUN'};
export function minutes(hhmm: string) { const [h,m]=hhmm.split(':').map(Number); return h*60+m; }
export function withinHours(date: Date, rule?: WorkingHours) {
  if (!rule || !rule.open) return false;
  const local = new Date(date);
  const current = local.getHours()*60+local.getMinutes();
  return current >= minutes(rule.start) && current < minutes(rule.end);
}
export function getWorkingDay(date: Date): WorkingDay { return map[date.getDay()]; }
export function durationMinutes(start: Date, end: Date) { return Math.max(0, Math.round((end.getTime()-start.getTime())/60000)); }
export function nextOpening(now: Date, rules: WorkingHours[]): {at:Date|null; label:string} {
  for (let offset=0; offset<8; offset++) {
    const d = new Date(now); d.setDate(now.getDate()+offset); d.setHours(0,0,0,0);
    const rule = rules.find(r=>r.day===getWorkingDay(d));
    if (!rule?.open) continue;
    const start = new Date(d); const [h,m]=rule.start.split(':').map(Number); start.setHours(h,m,0,0);
    if (start > now) return {at:start,label:rule.start};
  }
  return {at:null,label:''};
}
