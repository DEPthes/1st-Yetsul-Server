import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
import { LessThan } from 'typeorm';

@Injectable()
export class RecommendationService {
  private client: AxiosInstance;

  constructor(
    @InjectRepository(AlcoholRepository)
    private alcoholRepository: AlcoholRepository,
  ) {
    this.client = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5/',
      params: {
        APPID: 'c12bdbbf56bfc35592a66988f9acd4a1',
        units: 'metric'
      },
    });
  }

  // http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}
  // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=58ba0d59c042d7dddb59c641427042e5&units=metric
  async getTodaysWeather(lat: string, lon: string): Promise<any> {
    const response = await this.client.get(
      //   'weather', {
      //   params: { q: city },
      // }
      'weather', {
      params: { lat: lat || "37.532600", lon: lon || "127.024612"}, // 디폴트는 서울 주소
    }
    );

    const mainWeather = response.data.weather[0].main; // 날씨
    const weatherDescription = response.data.weather[0].description; // 상세 날씨
    const temperature = response.data.main.temp; // 온도
    const icon = response.data.weather[0].icon;
    const city = response.data.name;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // 날씨 아이콘
    console.log(response.data);

    return [mainWeather, temperature, iconUrl, weatherDescription, city];
  }

  async getWeatherRecommendation(weather: string) {
    if (weather == 'clean') {
      return await this.alcoholRepository.find({
        // order: {
        //   star: "ASC"
        // },
        where: [
          {
            bitter: true,
            AlcoholByVolume: LessThan(10)
          }
        ]
      });
    }
  }
}