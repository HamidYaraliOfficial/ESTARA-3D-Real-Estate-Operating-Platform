import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service'; import {QualityController} from './quality.controller'; import {PropertyQualityService} from './property-quality.service';
import { PrismaService } from '../common/prisma.service';
@Module({controllers:[PropertiesController,QualityController],providers:[PropertiesService,PropertyQualityService,PrismaService],exports:[PropertiesService]}) export class PropertiesModule {}
