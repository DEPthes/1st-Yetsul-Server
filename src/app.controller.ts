import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { LoginService } from './login/login.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private loginService: LoginService) { }
  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.loginService.googleLogin(req);
  }
}