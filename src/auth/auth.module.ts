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
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';

// const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}), // passport 등록
    JwtModule.register({ // jwt 등록
      secret: 'Secret1234', // process.env.JWT_SECRET || jwtConfig.secret, // secret: 'Secret1234', // 토큰 만들때 이용하는 비밀 키
      signOptions: {
        expiresIn: 60*60 // 60 * 60 // 몇초동안 토큰 유효한지
      }
    }),
    TypeOrmModule.forFeature([UserRepository, AlcoholRepository, S3Repository, LikeRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, NaverStrategy, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}
