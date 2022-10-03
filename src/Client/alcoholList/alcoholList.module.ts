import { Module } from '@nestjs/common';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from '../../Repository/review.repository';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { S3Repository } from '../../Repository/s3.repository';
import { UserRepository } from 'src/auth/user.repository';
import { IntroductionAlcoholController } from './introductionAlcohol/introductionAlcohol.controller';
import { IntroductionAlcoholService } from './introductionAlcohol/introductionAlcohol.service';
import { LikeRepository } from 'src/Repository/like.repository';
import { ReviewLikeRepository } from 'src/Repository/reviewLike.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}), // passport 등록
    JwtModule.register({ // jwt 등록
      secret: 'Secret1234', // process.env.JWT_SECRET || jwtConfig.secret, // secret: 'Secret1234', // 토큰 만들때 이용하는 비밀 키
      signOptions: {
        expiresIn: 60*60 // 60 * 60 // 몇초동안 토큰 유효한지
      }
    }),
    TypeOrmModule.forFeature([ReviewRepository, UserRepository, AlcoholRepository, S3Repository, LikeRepository, ReviewLikeRepository]),
  ],
  controllers: [ReviewController, IntroductionAlcoholController],
  providers: [ReviewService, IntroductionAlcoholService]
})
export class alcoholListModule {}
