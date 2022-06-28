import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class RecommendationService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5/',
      params: {
        APPID: 'c12bdbbf56bfc35592a66988f9acd4a1',
      },
    });
  }

  async ofCity(city: string): Promise<any> {
    const response = await this.client.get('weather', {
      params: { q: city },
    });
    
    const mainWeather = response.data.weather[0].main;
    const weatherDescription = response.data.weather[0].description;
    const icon = response.data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    //return response.data.weather[0];

    return [mainWeather, iconUrl, weatherDescription];
  }
}
