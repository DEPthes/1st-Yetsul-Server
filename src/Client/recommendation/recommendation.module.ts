import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlcoholRepository])
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService]
})
export class RecommendationModule {}
