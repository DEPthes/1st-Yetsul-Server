import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }

  // 서울 날씨, 아이콘 조회
  @Get('/weather')
  @ApiOperation({ summary: '서울 날씨, 아이콘 조회 API', description: '서울 날씨, 아이콘 조회' })
  @ApiCreatedResponse({ description: '서울 날씨, 아이콘 조회' })
  getWeather() {
    return this.recommendationService.ofCity("seoul");
  }
}