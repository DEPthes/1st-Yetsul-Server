import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { S3Repository } from 'src/Repository/s3.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { KakaoStrategy } from './kakao.strategy';
import { NaverStrategy } from './naver.strategy';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { LikeRepository } from 'src/Repository/like.repository';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserRepository, AlcoholRepository, S3Repository, LikeRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, NaverStrategy, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}
