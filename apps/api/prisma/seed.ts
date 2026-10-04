import { PrismaClient, PropertyStatus, PropertyType, ListingType, RoleName } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const agency = await prisma.agency.upsert({ where:{slug:'estara-demo'}, update:{}, create:{ name:'ESTARA Demo Agency', slug:'estara-demo', primaryColor:'#2563eb', secondaryColor:'#0f172a', timezone:'Asia/Baku' }});
  const cities = [
    { name:'Baku', country:'Azerbaijan', slug:'baku' },
    { name:'Dubai', country:'UAE', slug:'dubai' },
    { name:'Istanbul', country:'Türkiye', slug:'istanbul' },
  ];
  for (const city of cities) {
    const row = await prisma.city.upsert({ where:{slug:city.slug}, update:{name:city.name,country:city.country}, create:city });
    await prisma.neighborhood.upsert({ where:{cityId_slug:{cityId:row.id,slug:'central'}}, update:{}, create:{cityId:row.id,name:'Central',slug:'central',description:'Central district'}});
  }
  const admin = await prisma.user.upsert({ where:{email:'admin@estara.local'}, update:{agencyId:agency.id,name:'ESTARA Admin',role:RoleName.AGENCY_ADMIN}, create:{agencyId:agency.id,email:'admin@estara.local',name:'ESTARA Admin',role:RoleName.AGENCY_ADMIN} });
  await prisma.agent.upsert({ where:{userId:admin.id}, update:{}, create:{userId:admin.id,agencyId:agency.id,languages:['en','fa','zh'],specialties:['Luxury','Investment'],locations:['Baku','Dubai']} });
  const baku = await prisma.city.findUniqueOrThrow({where:{slug:'baku'}});
  const central = await prisma.neighborhood.findUniqueOrThrow({where:{cityId_slug:{cityId:baku.id,slug:'central'}}});
  const agent = await prisma.agent.findUniqueOrThrow({where:{userId:admin.id}});
  const examples = Array.from({length:24},(_,i)=>({
    agencyId:agency.id,cityId:baku.id,neighborhoodId:central.id,agentId:agent.id,
    slug:`estara-residence-${i+1}`,title:`ESTARA Residence ${i+1}`,
    description:'A production-backed sample listing for development environments.',
    propertyType: i%4===0?PropertyType.VILLA:PropertyType.APARTMENT,
    listingType: i%5===0?ListingType.RENT:ListingType.BUY,
    status:PropertyStatus.PUBLISHED,price:120000+i*7500,currency:'USD',area:75+i*4,bedrooms:2+(i%3),bathrooms:1+(i%2),parking:i%2,
    address:`Central District ${i+1}`,latitude:40.38+i*0.001,longitude:49.84+i*0.001,featured:i<6,popularity:100-i,
    tags:['modern','city','balcony']
  }));
  for (const data of examples) await prisma.property.upsert({where:{slug:data.slug},update:data,create:data});
  for (const day of ['MON','TUE','WED','THU','FRI','SAT','SUN']) {
    await prisma.workingHour.upsert({where:{agencyId_day:{agencyId:agency.id,day}},update:{},create:{agencyId:agency.id,day,open:day!=='SUN',start:'09:00',end:'18:00',slotMinutes:60}});
  }
  console.log('Seeded', agency.name);
}
main().finally(()=>prisma.$disconnect());
