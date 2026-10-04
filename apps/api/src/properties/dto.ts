import {IsArray,IsBoolean,IsEnum,IsInt,IsNumber,IsOptional,IsString,Max,MaxLength,Min} from 'class-validator';
export class CreatePropertyDto{
  @IsString() @MaxLength(160) title!:string;
  @IsString() description!:string;
  @IsString() slug!:string;
  @IsEnum(['APARTMENT','VILLA','OFFICE','SHOP','WAREHOUSE','LAND','PROJECT'] as any) propertyType!:string;
  @IsEnum(['BUY','RENT','COMMERCIAL','LAND','NEW_PROJECT'] as any) listingType!:string;
  @IsNumber() @Min(0) price!:number;
  @IsString() currency!:string;
  @IsNumber() @Min(0) area!:number;
  @IsInt() @Min(0) @Max(50) bedrooms!:number;
  @IsInt() @Min(0) @Max(50) bathrooms!:number;
  @IsString() address!:string;
  @IsString() cityId!:string;
  @IsOptional() @IsString() neighborhoodId?:string;
  @IsOptional() @IsString() agentId?:string;
  @IsOptional() @IsNumber() latitude?:number;
  @IsOptional() @IsNumber() longitude?:number;
  @IsOptional() @IsBoolean() featured?:boolean;
  @IsOptional() @IsArray() @IsString({each:true}) tags?:string[];
}
