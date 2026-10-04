import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import { AppModule } from './app.module';
async function bootstrap(){
  const app=await NestFactory.create(AppModule,{cors:true});
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.use((req:any,res:any,next:any)=>{ const id=req.headers['x-request-id']||randomUUID(); res.setHeader('x-request-id',id); req.requestId=id; next(); });
  app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true,forbidNonWhitelisted:true}));
  const swagger=new DocumentBuilder().setTitle('ESTARA API').setDescription('Multi-tenant real estate operating platform').setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('api/docs',app,SwaggerModule.createDocument(app,swagger));
  await app.listen(process.env.PORT ? Number(process.env.PORT):4000);
}
bootstrap();
