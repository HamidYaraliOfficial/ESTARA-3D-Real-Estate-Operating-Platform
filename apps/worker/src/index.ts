import { Queue, Worker, Job } from 'bullmq'; import IORedis from 'ioredis';
const connection=new IORedis(process.env.REDIS_URL||'redis://localhost:6379',{maxRetriesPerRequest:null});
export const events=new Queue('estara-events',{connection});
const worker=new Worker('estara-events',async(job:Job)=>{switch(job.name){case 'property.published': console.log('reindex property',job.data.propertyId); break;case 'saved_search.match': console.log('match saved search',job.data.savedSearchId); break;case 'appointment.reminder': console.log('send appointment reminder',job.data.appointmentId); break;case 'media.process': console.log('process media',job.data.objectKey); break;default: console.log('event',job.name,job.data);}}, {connection,concurrency:10});
worker.on('failed',(job,err)=>console.error('job failed',job?.id,err));
setInterval(async()=>{await events.add('maintenance.daily',{at:new Date().toISOString()},{removeOnComplete:100,removeOnFail:100,jobId:`maintenance-${new Date().toISOString().slice(0,10)}`}).catch(()=>{});},24*60*60*1000);
process.on('SIGTERM',async()=>{await worker.close();await connection.quit();});
