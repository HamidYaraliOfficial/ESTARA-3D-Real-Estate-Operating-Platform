import { Injectable, NotFoundException } from '@nestjs/common'; import { PrismaService } from '../common/prisma.service'; import { LeadStatus } from '@prisma/client';
@Injectable()
export class LeadsService {
  constructor(private readonly prisma:PrismaService){}
  list(agencyId:string){return this.prisma.lead.findMany({where:{agencyId},orderBy:{updatedAt:'desc'},include:{property:{select:{id:true,title:true,slug:true}},agent:{include:{user:{select:{name:true}}}}}});}
  async create(body:any,agencyId:string,creatorId?:string){return this.prisma.lead.create({data:{agencyId,creatorId,name:body.name,email:body.email,phone:body.phone,source:body.source,propertyId:body.propertyId,budget:body.budget,locationPreference:body.locationPreference,notes:body.notes,score:0}});}
  async move(id:string,status:LeadStatus,agencyId:string,actorId?:string){
    const lead=await this.prisma.lead.findFirst({where:{id,agencyId}}); if(!lead) throw new NotFoundException('Lead not found');
    return this.prisma.$transaction(async tx=>{
      const updated=await tx.lead.update({where:{id},data:{status}});
      await tx.leadStatusHistory.create({data:{leadId:id,fromStatus:lead.status,toStatus:status,actorId}});
      return updated;
    });
  }
  async score(id:string,agencyId:string){
    const lead=await this.prisma.lead.findFirst({where:{id,agencyId,propertyId:{not:null}}}); if(!lead) throw new NotFoundException('Lead not found');
    const [views,favs,inquiries,appointments]=await Promise.all([
      this.prisma.propertyView.count({where:{propertyId:lead.propertyId!,userId:lead.creatorId||undefined}}),
      this.prisma.favorite.count({where:{propertyId:lead.propertyId!,userId:lead.creatorId||undefined}}),
      this.prisma.inquiry.count({where:{propertyId:lead.propertyId!}}),
      this.prisma.appointment.count({where:{propertyId:lead.propertyId!,clientId:lead.creatorId||undefined}}),
    ]);
    const score=Math.min(100,views*2+favs*10+inquiries*15+appointments*25);
    return this.prisma.lead.update({where:{id},data:{score}});
  }
}
