import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@ApiTags("술 추천 페이지")
@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) { }


 
  // // 현재 날씨, 아이콘 조회
  // @ApiExcludeEndpoint()
  // @Get('/weather')
  // @ApiOperation({ summary: '현재 날씨, 아이콘 조회 API', description: '현재 날씨, 아이콘 조회' })
  // @ApiCreatedResponse({ description: '현재 날씨 조회. 사용자가 위치 정보 허용 하면 사용자의 위치로, 안하면 위치 서울로.' })
  // getTodaysWeather(@Body('lat') lat: string, @Body('lon') lon: string) {
  //   return this.recommendationService.getTodaysWeather(lat, lon);
  // }

  // 날씨에 따른 술 추천
  @Get('/weather/:id')
  @ApiOperation({ summary: '날씨에 따른 술 추천 API', description: '날씨에 따른 술 추천' })
  @ApiCreatedResponse({ description: '날씨에 따른 술 추천' })
  getWeatherRecommendation(@Param('id') id: string) {
    return this.recommendationService.getWeatherRecommendation(id);
  }

  @Post('/getweather')
  getWeather(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.recommendationService.getWeatherRecommendation(weather);
  }
 
  @Post('/getmood')
  getMood(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.recommendationService.getMoodRecommendation(mood);
  }

  @Post('/getsituation')
  getsituation(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.recommendationService.getSituationRecommendation(situation);
  }

  @Post('/total') // 태그 
  getRecommendation(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.recommendationService.getTotalRecommendation(weather, mood, situation);
    // return [weather, mood];
  }
}