import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as argon2 from 'argon2';
import { SignJWT, jwtVerify } from 'jose';
@Injectable()
export class AuthService {
  constructor(private readonly prisma:PrismaService) {}
  private secret(kind:'access'|'refresh') { return new TextEncoder().encode(process.env[kind==='access'?'JWT_ACCESS_SECRET':'JWT_REFRESH_SECRET']||`estara-${kind}-development-secret`); }
  async register(input:{email:string;password:string;name:string;agencyId?:string}) {
    const exists=await this.prisma.user.findUnique({where:{email:input.email}}); if(exists) throw new UnauthorizedException('Email already exists');
    const passwordHash=await argon2.hash(input.password); const user=await this.prisma.user.create({data:{...input,passwordHash,agencyId:input.agencyId||undefined}});
    return {user:this.safe(user),...(await this.tokens(user.id,user.agencyId||''))};
  }
  async login(email:string,password:string) {
    const user=await this.prisma.user.findUnique({where:{email}}); if(!user?.passwordHash||!(await argon2.verify(user.passwordHash,password))) throw new UnauthorizedException('Invalid credentials');
    return {user:this.safe(user),...(await this.tokens(user.id,user.agencyId||''))};
  }
  async tokens(userId:string,agencyId:string){
    const access=await new SignJWT({sub:userId,agencyId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('15m').sign(this.secret('access'));
    const refresh=await new SignJWT({sub:userId,agencyId,type:'refresh'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('30d').sign(this.secret('refresh'));
    return {accessToken:access,refreshToken:refresh};
  }
  async verify(token:string){ try{return (await jwtVerify(token,this.secret('access'))).payload;}catch{throw new UnauthorizedException('Invalid access token');} }
  private safe(user:any){ const {passwordHash,...safe}=user; return safe; }
}
