import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {

    }

    // @Get('auth/google/callback')
    // @UseGuards(AuthGuard('google'))
    // googleAuthRedirect(@Req() req) {
    //     return this.loginService.googleLogin(req);
    // }
}