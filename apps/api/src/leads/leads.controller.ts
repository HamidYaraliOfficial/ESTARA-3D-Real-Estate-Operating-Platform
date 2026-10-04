import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common'; import { LeadsService } from './leads.service';
@Controller('leads') export class LeadsController {
  constructor(private readonly s:LeadsService){} private tenant(h:any){return h['x-agency-id']||process.env.DEFAULT_AGENCY_ID||'';}
  @Get() list(@Headers() h:any){return this.s.list(this.tenant(h));}
  @Post() create(@Body() b:any,@Headers() h:any,@Headers('x-user-id') uid?:string){return this.s.create(b,this.tenant(h),uid);}
  @Patch(':id/status') move(@Param('id') id:string,@Body('status') status:any,@Headers() h:any,@Headers('x-user-id') uid?:string){return this.s.move(id,status,this.tenant(h),uid);}
  @Post(':id/score') score(@Param('id') id:string,@Headers() h:any){return this.s.score(id,this.tenant(h));}
}
