import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'; import { PrismaService } from '../common/prisma.service'; import { getWorkingDay, nextOpening } from '../common/time';
@Injectable() export class AppointmentsService {
  constructor(private readonly prisma:PrismaService){}
  async availability(agencyId:string,start:Date,days=14){
    const rules=await this.prisma.workingHour.findMany({where:{agencyId}}); const rows:any[]=[]; const now=new Date();
    for(let offset=0;offset<days;offset++){
      const day=new Date(start); day.setDate(start.getDate()+offset); const rule=rules.find(r=>r.day===getWorkingDay(day)); if(!rule?.open) continue;
      const [sh,sm]=rule.start.split(':').map(Number),[eh,em]=rule.end.split(':').map(Number); const cursor=new Date(day); cursor.setHours(sh,sm,0,0); const end=new Date(day); end.setHours(eh,em,0,0);
      while(cursor<end){ const slotEnd=new Date(cursor.getTime()+rule.slotMinutes*60000); if(slotEnd<=end && slotEnd>now){ const overlap=await this.prisma.appointment.findFirst({where:{agencyId,status:{notIn:['CANCELLED','COMPLETED','NO_SHOW']},startAt:{lt:slotEnd},endAt:{gt:cursor}}}); if(!overlap) rows.push({start:cursor.toISOString(),end:slotEnd.toISOString(),minutes:rule.slotMinutes}); } cursor.setMinutes(cursor.getMinutes()+rule.slotMinutes); }
    }
    return {slots:rows,nextOpening:nextOpening(new Date(),rules.map(r=>({day:r.day as any,open:r.open,start:r.start,end:r.end,slotMinutes:r.slotMinutes}))).at?.toISOString()||null};
  }
  async book(body:any,agencyId:string){
    const property=await this.prisma.property.findFirst({where:{id:body.propertyId,agencyId,status:{in:['PUBLISHED','APPROVED']}}}); if(!property) throw new NotFoundException('Property unavailable');
    const start=new Date(body.start); const end=new Date(start.getTime()+(Number(body.durationMinutes||60)*60000));
    const rule=await this.prisma.workingHour.findFirst({where:{agencyId,day:getWorkingDay(start)}}); if(!rule?.open) throw new BadRequestException('Agency is closed at the selected time');
    const overlap=await this.prisma.appointment.findFirst({where:{agencyId,status:{notIn:['CANCELLED','COMPLETED','NO_SHOW']},startAt:{lt:end},endAt:{gt:start}}}); if(overlap) throw new BadRequestException('This time is already booked');
    return this.prisma.appointment.create({data:{agencyId,propertyId:body.propertyId,clientId:body.clientId,agentId:body.agentId,clientName:body.clientName,clientEmail:body.clientEmail,clientPhone:body.clientPhone,startAt:start,endAt:end,status:'REQUESTED',notes:body.notes}});
  }
  list(agencyId:string){return this.prisma.appointment.findMany({where:{agencyId},orderBy:{startAt:'asc'},include:{property:{select:{title:true,slug:true}},agent:{include:{user:{select:{name:true}}}}}});}
  async status(id:string,status:any,agencyId:string){const row=await this.prisma.appointment.updateMany({where:{id,agencyId},data:{status}}); if(!row.count) throw new NotFoundException('Appointment not found'); return {ok:true};}
}
