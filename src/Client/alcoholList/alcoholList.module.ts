import { Module } from '@nestjs/common';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from '../../Repository/review.repository';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { S3Repository } from '../../Repository/s3.repository';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewRepository, UserRepository, AlcoholRepository, S3Repository]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class alcoholListModule {}
