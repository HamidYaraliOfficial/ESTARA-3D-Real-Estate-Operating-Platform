import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common'; import { AppointmentsService } from './appointments.service';
@Controller('appointments') export class AppointmentsController {
  constructor(private readonly s:AppointmentsService){} private tenant(h:any){return h['x-agency-id']||process.env.DEFAULT_AGENCY_ID||'';}
  @Get() list(@Headers() h:any){return this.s.list(this.tenant(h));}
  @Get('availability') availability(@Headers() h:any,@Query('start') start?:string,@Query('days') days?:string){return this.s.availability(this.tenant(h),new Date(start||Date.now()),Number(days||14));}
  @Post() book(@Body() b:any,@Headers() h:any){return this.s.book(b,this.tenant(h));}
  @Patch(':id/status') status(@Param('id') id:string,@Body('status') status:any,@Headers() h:any){return this.s.status(id,status,this.tenant(h));}
}
