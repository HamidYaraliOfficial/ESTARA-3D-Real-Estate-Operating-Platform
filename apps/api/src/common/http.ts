import {BadRequestException} from '@nestjs/common';
export function positiveInt(value:unknown, fallback:number, max:number){const n=Number(value);if(!Number.isFinite(n))return fallback;return Math.min(max,Math.max(1,Math.trunc(n)));}
export function optionalNumber(value:unknown){if(value===undefined||value===null||value==='')return undefined;const n=Number(value);if(!Number.isFinite(n))throw new BadRequestException('Invalid numeric query parameter');return n;}
export function sanitizeLike(value:string){return value.replace(/[\\%_]/g,'').trim().slice(0,200);}
export function normalizeEmail(value:string){return value.trim().toLowerCase();}
export function pagination(limitValue:unknown,cursor?:string){return {limit:positiveInt(limitValue,24,100),cursor:cursor?.slice(0,200)}}
