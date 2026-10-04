import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
@Controller('properties')
export class PropertiesController {
  constructor(private readonly service:PropertiesService){}
  private tenant(headers:any){return headers['x-agency-id']||process.env.DEFAULT_AGENCY_ID||'';}
  @Get() search(@Query() q:any,@Headers() h:any){ return this.service.search({ ...q, limit:q.limit?Number(q.limit):24, minPrice:q.minPrice?Number(q.minPrice):undefined,maxPrice:q.maxPrice?Number(q.maxPrice):undefined,minArea:q.minArea?Number(q.minArea):undefined,maxArea:q.maxArea?Number(q.maxArea):undefined,bedrooms:q.bedrooms?Number(q.bedrooms):undefined,bathrooms:q.bathrooms?Number(q.bathrooms):undefined },this.tenant(h)); }
  @Get('nearby') nearby(@Query('lat') lat:string,@Query('lng') lng:string,@Query('radius') radius:string,@Headers() h:any){return this.service.nearby(Number(lat),Number(lng),Number(radius||5000),this.tenant(h));}
  @Get(':slug') detail(@Param('slug') slug:string,@Headers() h:any){return this.service.detail(slug,this.tenant(h));}
  @Post() create(@Body() body:any,@Headers() h:any){return this.service.create(body,this.tenant(h));}
  @Put(':id') update(@Param('id') id:string,@Body() body:any,@Headers() h:any){return this.service.update(id,body,this.tenant(h));}
  @Post(':id/favorite') favorite(@Param('id') id:string,@Headers('x-user-id') userId:string){return this.service.favorite(id,userId);}
  @Delete(':id/favorite') unfavorite(@Param('id') id:string,@Headers('x-user-id') userId:string){return this.service.unfavorite(id,userId);}
}
