// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import axios, { AxiosInstance } from 'axios';
// import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
// import { LessThan } from 'typeorm';

// @Injectable()
// export class RecommendationService {
//   private client: AxiosInstance;

//   constructor(
//     @InjectRepository(AlcoholRepository)
//     private alcoholRepository: AlcoholRepository,
//   ) {
//     this.client = axios.create({
//       baseURL: 'https://api.openweathermap.org/data/2.5/',
//       params: {
//         APPID: 'c12bdbbf56bfc35592a66988f9acd4a1',
//         units: 'metric'
//       },
//     });
//   }

//   // http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}
//   // https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=58ba0d59c042d7dddb59c641427042e5&units=metric
//   async getTodaysWeather(lat: string, lon: string): Promise<any> {
//     const response = await this.client.get(
//       //   'weather', {
//       //   params: { q: city },
//       // }
//       'weather', {
//       params: { lat: lat || "37.532600", lon: lon || "127.024612"}, // 디폴트는 서울 주소
//     }
//     );

//     const mainWeather = response.data.weather[0].main; // 날씨
//     const weatherDescription = response.data.weather[0].description; // 상세 날씨
//     const temperature = response.data.main.temp; // 온도
//     const icon = response.data.weather[0].icon;
//     const city = response.data.name;
//     const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // 날씨 아이콘
//     console.log(response.data);

//     return [mainWeather, temperature, iconUrl, weatherDescription, city];
//   }

//   async getWeatherRecommendation(weather: string) {
//     if (weather == 'clean') {
//       return await this.alcoholRepository.find({
//         // order: {
//         //   star: "ASC"
//         // },
//         where: [
//           {
//             bitter: true,
//             AlcoholByVolume: LessThan(10)
//           }
//         ]
//       });
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
import { LessThan, MoreThan } from 'typeorm';

@Injectable()
export class RecommendationService {

  constructor(
    @InjectRepository(AlcoholRepository)
    private alcoholRepository: AlcoholRepository,
  ) { }

  async getWeatherRecommendation(weather: string) {
    let category = [];

    if (weather == 'clean') {
      category.push(4);
    }

    else if (weather == 'cloud') {
      category.push(3);
    }

    else if ((weather == 'rain') || (weather == 'shower rain')) {
      category.push(1);
    }

    else if (weather == 'snow') {
      category.push(6);
    }

    else if (weather == 'thunderstorm') {
      category.push(2);
      category.push(5);
    }

    return category; // category[0]
  }

  async getMoodRecommendation(mood: string) {
    let AlcoholByVolume1 = 0;
    let AlcoholByVolume2 = 10;

    if ((mood == 'joy') || (mood == 'excited')) {
      // 그대로
    }

    else if ((mood == 'sad') || (mood == 'gloom') || (mood == 'drink')) {
      AlcoholByVolume1 = 10;
      AlcoholByVolume2 = 20;
    }

    else if (mood == 'anger') {
      AlcoholByVolume1 = 20;
      AlcoholByVolume2 = 30;
    }

    else if (mood == 'sentimental') {
      AlcoholByVolume1 = 30;
      AlcoholByVolume2 = 40;
    }

    else if (mood == 'flutter') {
      AlcoholByVolume1 = 40;
      AlcoholByVolume2 = 50;
    }

    return [AlcoholByVolume1, AlcoholByVolume2];
  }

  async getSituationRecommendation(situation: string) {
    let select_cool = false;
    let select_clean = false;
    let select_bitter = false;
    let select_sweet = false;
    let select_sour = false;

    switch (situation) {
      case 'party':
        select_cool = true; break;
      case 'festival':
        select_clean = true; break;
      case 'exam':
        select_bitter = true; break;
      case 'meeting':
        select_sweet = true; break
      case 'meeting':
        select_sour = true; break
      case 'picnic':
        select_sour = true; break
    }

    return [select_cool, select_clean, select_bitter, select_sweet, select_sour];
  }

  async getTotalRecommendation(weather: string, mood: string, situation: string) {
    const select_categoryId = await this.getWeatherRecommendation(weather);

    const alcoholByVolume = await this.getMoodRecommendation(mood);

    const select_alcoholByVolume1 = alcoholByVolume[0];
    const select_alcoholByVolume2 = alcoholByVolume[1];

    const taste = await this.getSituationRecommendation(situation);

    const select_cool = taste[0];
    const select_clean = taste[1];
    const select_bitter = taste[2];
    const select_sweet = taste[3];
    const select_sour = taste[4];

    // 맛 이렇게 하면 거의 안나옴. 다른거 다 F로 하면 안되고 옵션으로?
    // 아니면 도수 빼고 ..
    // 우선순위 포인트 현빈
    let resultArray = await this.alcoholRepository
      .createQueryBuilder('todo')
      .where("todo.category IN (:...categories)", { categories: select_categoryId })
      .andWhere('todo.AlcoholByVolume >= :select_alcoholByVolume1', { select_alcoholByVolume1 })
      .andWhere('todo.AlcoholByVolume < :select_alcoholByVolume2', { select_alcoholByVolume2 })
      .andWhere("todo.cool = :select_cool", { select_cool })
      .andWhere("todo.clean = :select_clean", { select_clean })
      .andWhere("todo.bitter = :select_bitter", { select_bitter })
      .andWhere("todo.sweet = :select_sweet", { select_sweet })
      .andWhere("todo.sour = :select_sour", { select_sour })
      .orderBy("RANDOM()")
      .getMany();

    return resultArray;
  }
}