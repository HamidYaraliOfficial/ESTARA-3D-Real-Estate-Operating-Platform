import {minutes,withinHours} from '../src/common/time';
describe('time helpers',()=>{it('parses minutes',()=>expect(minutes('10:30')).toBe(630));it('checks business hours',()=>{const d=new Date();d.setHours(10,0,0,0);expect(withinHours(d,{day:'MON',open:true,start:'09:00',end:'18:00',slotMinutes:60})).toBe(true)});});
