import {IsDateString,IsEmail,IsInt,IsOptional,IsString,Max,Min,IsUUID} from 'class-validator';
export class CreateAppointmentDto{
  @IsUUID() propertyId!:string;
  @IsDateString() start!:string;
  @IsInt() @Min(15) @Max(240) durationMinutes=60;
  @IsString() clientName!:string;
  @IsEmail() clientEmail!:string;
  @IsOptional() @IsString() clientPhone?:string;
  @IsOptional() @IsUUID() clientId?:string;
  @IsOptional() @IsUUID() agentId?:string;
  @IsOptional() @IsString() notes?:string;
}
