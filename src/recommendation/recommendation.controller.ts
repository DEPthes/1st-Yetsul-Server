import { Body, Controller, Get, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }

  // 현재 날씨, 아이콘 조회
  @Get('/weather')
  @ApiOperation({ summary: '현재 날씨, 아이콘 조회 API', description: '현재 날씨, 아이콘 조회' })
  @ApiCreatedResponse({ description: '현재 날씨 조회. 사용자가 위치 정보 허용 하면 사용자의 위치로, 안하면 위치 서울로.' })
  getTodaysWeather(@Body('lat') lat: string, @Body('lon') lon: string) {
    return this.recommendationService.getTodaysWeather(lat, lon);
  }

  // 날씨에 따른 술 추천
  @Get('/weather/:id') // 태그 
  getWeatherRecommendation(@Param('id') id: string) {
    return this.recommendationService.getWeatherRecommendation(id);
  }

  // 날씨에 따른 술 추천
  @Get('/mood/:id') // 태그 
  getMoodRecommendation(@Param('id') id: string) {
    return this.recommendationService.getMoodRecommendation(id);
  }

  @Get('/event/:id') // 태그 
  getEventRecommendation(@Param('id') id: string) {
    return this.recommendationService.getEventRecommendation(id);
  }
}