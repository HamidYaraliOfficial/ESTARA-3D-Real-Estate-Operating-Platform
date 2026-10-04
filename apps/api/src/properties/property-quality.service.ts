import {Injectable} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
export interface QualityIssue {code:string;severity:'LOW'|'MEDIUM'|'HIGH';propertyId:string;message:string;}
@Injectable()
export class PropertyQualityService {
  constructor(private readonly prisma:PrismaService){}
  async scan(agencyId:string){
    const properties=await this.prisma.property.findMany({where:{agencyId},include:{media:true,agent:true,city:true}});
    const issues:QualityIssue[]=[];
    for(const p of properties){
      if(!p.title.trim()) issues.push({code:'MISSING_TITLE',severity:'HIGH',propertyId:p.id,message:'Property title is missing'});
      if(p.description.trim().length<40) issues.push({code:'SHORT_DESCRIPTION',severity:'LOW',propertyId:p.id,message:'Description is shorter than the recommended minimum'});
      if(Number(p.price)<=0) issues.push({code:'MISSING_PRICE',severity:'HIGH',propertyId:p.id,message:'Price is missing or invalid'});
      if(Number(p.area)<=0) issues.push({code:'MISSING_AREA',severity:'HIGH',propertyId:p.id,message:'Area is missing or invalid'});
      if(!p.cityId) issues.push({code:'MISSING_CITY',severity:'MEDIUM',propertyId:p.id,message:'City is missing'});
      if(!p.agentId) issues.push({code:'MISSING_AGENT',severity:'MEDIUM',propertyId:p.id,message:'Agent is not assigned'});
      if(!p.latitude||!p.longitude) issues.push({code:'MISSING_COORDINATES',severity:'MEDIUM',propertyId:p.id,message:'Coordinates are missing'});
      if(!p.media.length) issues.push({code:'MISSING_MEDIA',severity:'MEDIUM',propertyId:p.id,message:'No media is attached'});
      if(p.slug.length<3) issues.push({code:'WEAK_SLUG',severity:'LOW',propertyId:p.id,message:'Slug should be descriptive'});
      if(p.status==='PUBLISHED'&&!p.publishedAt) issues.push({code:'PUBLISH_TIMESTAMP',severity:'LOW',propertyId:p.id,message:'Published property has no publication timestamp'});
      if(p.bedrooms<0||p.bathrooms<0||p.parking<0) issues.push({code:'NEGATIVE_ROOMS',severity:'HIGH',propertyId:p.id,message:'Room and parking counts cannot be negative'});
      if(p.totalFloors!==null&&p.floor!==null&&p.floor>p.totalFloors) issues.push({code:'INVALID_FLOOR',severity:'HIGH',propertyId:p.id,message:'Floor exceeds total floors'});
    }
    return {totalProperties:properties.length,totalIssues:issues.length,issues,summary:{high:issues.filter(x=>x.severity==='HIGH').length,medium:issues.filter(x=>x.severity==='MEDIUM').length,low:issues.filter(x=>x.severity==='LOW').length}};
  }
  async canPublish(id:string,agencyId:string){
    const p=await this.prisma.property.findFirst({where:{id,agencyId},include:{media:true,agent:true}});
    if(!p)return {allowed:false,reasons:['Property not found']};
    const reasons:string[]=[];
    if(p.title.trim().length<5) reasons.push('Title must contain at least 5 characters');
    if(p.description.trim().length<40) reasons.push('Description must contain at least 40 characters');
    if(Number(p.price)<=0) reasons.push('Price must be greater than zero');
    if(Number(p.area)<=0) reasons.push('Area must be greater than zero');
    if(!p.agentId) reasons.push('Assign an agent before publishing');
    if(!p.cityId) reasons.push('Assign a city before publishing');
    if(!p.media.some(m=>m.visible)) reasons.push('Attach at least one visible media asset');
    return {allowed:reasons.length===0,reasons};
  }
  async duplicateCandidates(id:string,agencyId:string){
    const p=await this.prisma.property.findFirst({where:{id,agencyId}});if(!p)return [];
    return this.prisma.property.findMany({where:{agencyId,id:{not:id},OR:[{address:{equals:p.address,mode:'insensitive'}},{slug:{contains:p.slug.split('-')[0],mode:'insensitive'}}]},take:20,select:{id:true,slug:true,title:true,address:true,price:true,area:true,latitude:true,longitude:true}});
  }
  async bulkUpdate(agencyId:string,ids:string[],data:{status?:any;agentId?:string|null;featured?:boolean;price?:number;tags?:string[]}){
    if(!ids.length)return {count:0};
    return this.prisma.property.updateMany({where:{agencyId,id:{in:ids}},data:{status:data.status,agentId:data.agentId,featured:data.featured,price:data.price, tags:data.tags}});
  }
  async exportRows(agencyId:string){
    const rows=await this.prisma.property.findMany({where:{agencyId},select:{id:true,slug:true,title:true,price:true,currency:true,area:true,bedrooms:true,bathrooms:true,status:true,listingType:true,propertyType:true,address:true,createdAt:true,updatedAt:true}});
    return rows.map(r=>({id:r.id,slug:r.slug,title:r.title,price:Number(r.price),currency:r.currency,area:Number(r.area),bedrooms:r.bedrooms,bathrooms:r.bathrooms,status:r.status,listingType:r.listingType,propertyType:r.propertyType,address:r.address,createdAt:r.createdAt.toISOString(),updatedAt:r.updatedAt.toISOString()}));
  }
  csv(rows:any[]){
    if(!rows.length)return '';
    const keys=Object.keys(rows[0]);
    const quote=(v:any)=>`"${String(v??'').replace(/"/g,'""')}"`;
    return [keys.join(','),...rows.map(row=>keys.map(k=>quote(row[k])).join(','))].join('\n');
  }
}
