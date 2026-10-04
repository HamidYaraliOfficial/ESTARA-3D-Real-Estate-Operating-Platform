import { Injectable } from '@nestjs/common'; import { PrismaService } from '../common/prisma.service';
@Injectable() export class SettingsService {
  constructor(private readonly prisma:PrismaService){}
  async agency(agencyId:string){const [agency,hours]=await Promise.all([this.prisma.agency.findUnique({where:{id:agencyId}}),this.prisma.workingHour.findMany({where:{agencyId},orderBy:{day:'asc'}})]);return {agency,hours};}
  async saveWorkingHour(agencyId:string,body:any){return this.prisma.workingHour.upsert({where:{agencyId_day:{agencyId,day:body.day}},update:{open:body.open,start:body.start,end:body.end,slotMinutes:body.slotMinutes},create:{agencyId,day:body.day,open:body.open,start:body.start,end:body.end,slotMinutes:body.slotMinutes}});}
  async flags(){return this.prisma.featureFlag.findMany({orderBy:{key:'asc'}});}
}
