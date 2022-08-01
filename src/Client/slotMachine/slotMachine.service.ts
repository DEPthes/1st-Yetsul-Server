
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { LessThan, MoreThan } from 'typeorm';

@Injectable()
export class slotMachineService {

  constructor(
    @InjectRepository(AlcoholRepository)
    private alcoholRepository: AlcoholRepository,
  ) { }

  // 날씨에 따라 추천하는 주종 설정 메서드
  async getWeatherRecommendation(weather: string) {
    let category = [];
    if (weather == 'clean') { // 맑음
      category.push(2); // 청주, 과실주, 약주
      category.push(3); // 청주, 과실주, 약주
      category.push(4); // 청주, 과실주, 약주
      category.push(6); // 청주, 과실주, 약주, 리큐르
    }

    else if (weather == 'cloud') {
      category.push(1); // 약주, 탁주, 리큐르 주
      category.push(3); // 약주, 탁주, 리큐르 주 
      category.push(6); // 약주, 탁주, 리큐르 주 
    }

    else if ((weather == 'rain') || (weather == 'shower rain')) {
      category.push(1);//탁주, 리큐르 주, 증
      category.push(5);//탁주, 리큐르 주, 증
      category.push(6);//탁주, 리큐르 주, 증
    }

    else if (weather == 'snow') {
      category.push(1);//리큐르 주, 과실주, 탁주 
      category.push(2);//리큐르 주, 과실주, 탁주 
      category.push(6);//리큐르 주, 과실주, 탁주 
    }

    else if (weather == 'thunderstorm') {
      category.push(1);//리큐르 주, 과실주, 탁주, 
      category.push(2);//리큐르 주, 과실주, 탁주, 
      category.push(6);//리큐르 주, 과실주, 탁주, 
    }

    return category; // category[0]
  }

  // 분위기에 해당되는 도수 범위 설정 메서드
  async getMoodRecommendation(mood: string) {
    let AlcoholByVolumeMoreThan = 0;
    let AlcoholByVolumeLessThan = 10;

    if ((mood == 'joy') || (mood == 'excited')) {
      // 그대로
    }

    else if ((mood == 'sad') || (mood == 'gloom') || (mood == 'drink')) {
      AlcoholByVolumeMoreThan = 5;
      AlcoholByVolumeLessThan = 15;
    }

    else if (mood == 'flutter') {
      AlcoholByVolumeMoreThan = 10;
      AlcoholByVolumeLessThan = 20;
    }
    
    else if (mood == 'sentimental') {
      AlcoholByVolumeMoreThan = 20;
      AlcoholByVolumeLessThan = 40;
    }
    
    else if (mood == 'anger') {
      AlcoholByVolumeMoreThan = 30;
      AlcoholByVolumeLessThan = 50;
    }
    
    return [AlcoholByVolumeMoreThan, AlcoholByVolumeLessThan];
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

  // 날씨, 기분별로 정한 기준에 따라 결과로 도출되는 메서드
  async getTotalRecommendation(weather: string, mood: string, situation: string) {
    const select_categoryId = await this.getWeatherRecommendation(weather);

    const alcoholByVolume = await this.getMoodRecommendation(mood);

    const select_alcoholByVolume1 = alcoholByVolume[0];
    const select_alcoholByVolume2 = alcoholByVolume[1];

    let resultArray = await this.alcoholRepository
      .createQueryBuilder('todo')
      .where("todo.category IN (:...categories)", { categories: select_categoryId })
      .andWhere('todo.AlcoholByVolume >= :select_alcoholByVolume1', { select_alcoholByVolume1 })
      .andWhere('todo.AlcoholByVolume < :select_alcoholByVolume2', { select_alcoholByVolume2 })
      .orderBy("RANDOM()")
      .getMany();

    return [resultArray[0], resultArray[1], resultArray[2]];
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import axios, { AxiosInstance } from 'axios';
// import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
// import { LessThan } from 'typeorm';

// @Injectable()
// export class slotMachineService {
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
