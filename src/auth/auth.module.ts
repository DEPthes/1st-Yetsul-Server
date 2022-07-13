import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { NaverStrategy } from './naver.strategy';

@Module({
  imports: [
    
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, NaverStrategy, JwtStrategy],
})
export class AuthModule {}
