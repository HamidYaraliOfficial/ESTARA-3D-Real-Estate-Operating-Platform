import { Controller, Get, Headers } from '@nestjs/common'; import { AnalyticsService } from './analytics.service';
@Controller('analytics') export class AnalyticsController { constructor(private readonly s:AnalyticsService){} @Get('market') market(@Headers() h:any){return this.s.market(h['x-agency-id']||process.env.DEFAULT_AGENCY_ID||'');} }
