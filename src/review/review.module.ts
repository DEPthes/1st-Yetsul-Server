import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
import { S3Repository } from './s3.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewRepository, AlcoholRepository, S3Repository]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
