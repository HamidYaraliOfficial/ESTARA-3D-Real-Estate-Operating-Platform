import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import type { SearchFilters, PropertyDetail } from '@estara/types';
@Injectable()
export class PropertiesService {
  constructor(private readonly prisma:PrismaService) {}
  async search(filters:SearchFilters,agencyId:string){
    const where:Prisma.PropertyWhereInput={agencyId,status:'PUBLISHED'};
    if(filters.q) where.OR=[{title:{contains:filters.q,mode:'insensitive'}},{description:{contains:filters.q,mode:'insensitive'}},{address:{contains:filters.q,mode:'insensitive'}}];
    if(filters.listingType) where.listingType=filters.listingType as any;
    if(filters.propertyType) where.propertyType=filters.propertyType as any;
    if(filters.cityId) where.cityId=filters.cityId;
    if(filters.neighborhoodId) where.neighborhoodId=filters.neighborhoodId;
    if(filters.minPrice!==undefined || filters.maxPrice!==undefined) where.price={};
    if(filters.minPrice!==undefined) (where.price as any).gte=filters.minPrice;
    if(filters.maxPrice!==undefined) (where.price as any).lte=filters.maxPrice;
    if(filters.minArea!==undefined || filters.maxArea!==undefined) where.area={};
    if(filters.minArea!==undefined) (where.area as any).gte=filters.minArea;
    if(filters.maxArea!==undefined) (where.area as any).lte=filters.maxArea;
    if(filters.bedrooms!==undefined) where.bedrooms={gte:filters.bedrooms};
    if(filters.bathrooms!==undefined) where.bathrooms={gte:filters.bathrooms};
    const orderBy:any=filters.sort==='price_asc'?{price:'asc'}:filters.sort==='price_desc'?{price:'desc'}:filters.sort==='area_desc'?{area:'desc'}:filters.sort==='popular'?{popularity:'desc'}:filters.sort==='featured'?{featured:'desc'}:{createdAt:'desc'};
    const limit=filters.limit||24;
    const rows=await this.prisma.property.findMany({where,orderBy,take:limit+1,include:{city:true,neighborhood:true,media:{where:{visible:true},orderBy:{sortOrder:'asc'},take:1},amenities:{include:{amenity:true}}}});
    const hasMore=rows.length>limit; const data=(hasMore?rows.slice(0,limit):rows).map(this.toCard);
    return {data,meta:{pageSize:limit,total:data.length,cursor:hasMore?data[data.length-1]?.id:null}};
  }
  async nearby(lat:number,lng:number,radiusMeters:number,agencyId:string){
    const rows=await this.prisma.$queryRaw<any[]>(Prisma.sql`
      SELECT p.id,p.slug,p.title,p.price,p.currency,p.area,p.bedrooms,p.bathrooms,p."propertyType",p."listingType",p.status,
             p.featured,p.latitude,p.longitude,c.name AS city,n.name AS neighborhood,
             ST_Distance(ST_SetSRID(ST_MakePoint(p.longitude::double precision,p.latitude::double precision),4326)::geography,
                         ST_SetSRID(ST_MakePoint(${lng},${lat}),4326)::geography) AS distance
      FROM "Property" p JOIN "City" c ON c.id=p."cityId" LEFT JOIN "Neighborhood" n ON n.id=p."neighborhoodId"
      WHERE p."agencyId"=${agencyId} AND p.status='PUBLISHED' AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      AND ST_DWithin(ST_SetSRID(ST_MakePoint(p.longitude::double precision,p.latitude::double precision),4326)::geography,
                    ST_SetSRID(ST_MakePoint(${lng},${lat}),4326)::geography,${radiusMeters})
      ORDER BY distance ASC LIMIT 100`);
    return {data:rows};
  }
  async detail(slug:string,agencyId:string):Promise<PropertyDetail>{
    const p=await this.prisma.property.findFirst({where:{slug,agencyId,status:{not:'ARCHIVED'}},include:{city:true,neighborhood:true,media:{where:{visible:true},orderBy:{sortOrder:'asc'}},amenities:{include:{amenity:true}},prices:{orderBy:{createdAt:'asc'}}}});
    if(!p) throw new NotFoundException('Property not found');
    return {...this.toCard(p),description:p.description,floor:p.floor||undefined,totalFloors:p.totalFloors||undefined,yearBuilt:p.yearBuilt||undefined,parking:p.parking,furnishing:p.furnishing||undefined,amenities:p.amenities.map(x=>x.amenity.name),tags:p.tags,priceHistory:p.prices.map(x=>({price:Number(x.price),date:x.createdAt.toISOString()})),media:p.media.map(x=>({id:x.id,kind:x.kind as any,url:x.url,alt:x.alt||undefined,caption:x.caption||undefined}))};
  }
  async create(input:any,agencyId:string){ return this.prisma.property.create({data:{...input,agencyId,price:Number(input.price),area:Number(input.area)}}); }
  async update(id:string,input:any,agencyId:string){ return this.prisma.property.updateMany({where:{id,agencyId},data:{...input,price:input.price===undefined?undefined:Number(input.price),area:input.area===undefined?undefined:Number(input.area)}}); }
  async favorite(propertyId:string,userId:string){ return this.prisma.favorite.upsert({where:{userId_propertyId:{userId,propertyId}},update:{},create:{userId,propertyId}}); }
  async unfavorite(propertyId:string,userId:string){ await this.prisma.favorite.delete({where:{userId_propertyId:{userId,propertyId}}}); return {ok:true}; }
  private toCard(p:any){return {id:p.id,slug:p.slug,title:p.title,city:p.city?.name||'',neighborhood:p.neighborhood?.name,price:Number(p.price),currency:p.currency,area:Number(p.area),bedrooms:p.bedrooms,bathrooms:p.bathrooms,propertyType:p.propertyType,listingType:p.listingType,status:p.status,featured:p.featured,imageUrl:p.media?.[0]?.url,lat:p.latitude?Number(p.latitude):undefined,lng:p.longitude?Number(p.longitude):undefined};}
}
