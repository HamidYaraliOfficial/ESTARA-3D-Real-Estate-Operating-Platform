import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly auth:AuthService){}
  @Post('register') register(@Body() body:any){return this.auth.register(body);}
  @Post('login') login(@Body() body:any){return this.auth.login(body.email,body.password);}
  @Get('verify') async verify(@Headers('authorization') header?:string){ const token=header?.replace(/^Bearer\s+/i,''); return {payload:await this.auth.verify(token||'')}; }
}
