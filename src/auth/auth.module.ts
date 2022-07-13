import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { KakaoStrategy } from './kakao.strategy';
import { NaverStrategy } from './naver.strategy';

@Module({
  imports: [
    
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, NaverStrategy, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}
