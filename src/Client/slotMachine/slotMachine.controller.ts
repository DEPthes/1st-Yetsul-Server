import { Body, Controller, Post } from '@nestjs/common';
import { slotMachineService } from './slotMachine.service';

@Controller('slotMachine')
export class slotMachineController {
  constructor(private readonly slotMachineService: slotMachineService) { }

  @Post('/getweather')
  getWeather(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.slotMachineService.getWeatherRecommendation(weather);
  }
 
  @Post('/getmood')
  getMood(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.slotMachineService.getMoodRecommendation(mood);
  }

  @Post('/getsituation')
  getsituation(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.slotMachineService.getSituationRecommendation(situation);
  }

  @Post('/total')
  async getRecommendation(@Body('weather') weather: string, @Body('mood') mood: string, @Body('situation') situation: string) {
    return this.slotMachineService.getTotalRecommendation(weather, mood, situation);
  }
}