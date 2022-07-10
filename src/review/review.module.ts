import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewRepository, AlcoholRepository]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
