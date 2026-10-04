import { Body, Controller, Get, Headers, Put } from '@nestjs/common'; import { SettingsService } from './settings.service';
@Controller('settings') export class SettingsController { constructor(private readonly s:SettingsService){} private tenant(h:any){return h['x-agency-id']||process.env.DEFAULT_AGENCY_ID||'';}
@Get('agency') agency(@Headers() h:any){return this.s.agency(this.tenant(h));}
@Put('working-hours') hours(@Headers() h:any,@Body() body:any){return this.s.saveWorkingHour(this.tenant(h),body);}
@Get('feature-flags') flags(){return this.s.flags();}}
