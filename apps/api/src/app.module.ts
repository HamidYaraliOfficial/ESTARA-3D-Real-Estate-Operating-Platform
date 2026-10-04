import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { LeadsModule } from './leads/leads.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SettingsModule } from './settings/settings.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RealtimeModule } from './realtime/realtime.module';
import { StorageModule } from './storage/storage.module';
import { SearchModule } from './search/search.module';
@Module({ imports:[ConfigModule.forRoot({isGlobal:true}),AuthModule,PropertiesModule,LeadsModule,AppointmentsModule,SettingsModule,AnalyticsModule,AuditModule,NotificationsModule,RealtimeModule,StorageModule,SearchModule], providers:[PrismaService], exports:[PrismaService] })
export class AppModule {}
