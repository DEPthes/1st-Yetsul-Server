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
      params: { lat: lat || "37.532600", lon: lon || "127.024612" }, // 디폴트는 서울 주소
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
    let select_sweet = false;
    let select_bitter = false;
    let select_refreshing = false;
    let select_clean = false;
    let select_cool = false;
    let select_sour = false;

    if (weather == 'clean') {
      select_sweet = true;
      select_refreshing = true;
      select_cool = true;
    }

    else if (weather == 'cloud') {
      select_bitter = true;
      select_clean = true;
    }

    else if (weather == 'rain') {
      select_sweet = true;
      select_cool = true;
    }

    else if (weather == 'snow') {
      select_sweet = true;
      select_clean = true;
    }

    else if (weather == 'shower rain') {
      select_bitter = true;
      select_cool = true;
    }

    else if (weather == 'thunderstorm') {
      select_refreshing = true;
      select_sour = true;
    }

    let resultArrays;

    const resultArray1 = await this.alcoholRepository
      .createQueryBuilder('query1')
      .where("query1.cool = :select_cool", { select_cool })
      .andWhere("query1.clean = :select_clean", { select_clean })
      .andWhere("query1.bitter = :select_bitter", { select_bitter })
      .andWhere("query1.sweet = :select_sweet", { select_sweet })
      .andWhere("query1.refreshing = :select_refreshing", { select_refreshing })
      .andWhere("query1.sour = :select_sour", { select_sour })
      .orderBy("RANDOM()")
      .getMany();

    if (resultArray1.length >= 3) {
      resultArrays = [resultArray1[0], resultArray1[1], resultArray1[2]]
      return resultArrays;
    }


    // for (let i = 0; i < 3; i++) {
    // const resultId = await this.alcoholRepository
    //           .createQueryBuilder('ids')
    //           .select("ids.id", "id")
    //           .from(resultArrays[i])
    // } 중복을 제거하려고 들인 노력의 흔적,,,

    if (resultArray1.length < 3) {
      let resultArray2;

      if (weather == 'clean') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (weather == 'cloud') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (weather == 'rain') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (weather == 'snow') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (weather == 'shower rain') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (weather == 'thunderstorm') {
        let select_others = true;
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.sour = :select_sour", { select_sour })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      if (resultArray1.length == 2) {
        resultArrays = [resultArray1[0], resultArray1[1], resultArray2[0]]
      }

      else if (resultArray1.length == 1) {
        resultArrays = [resultArray1[0], resultArray2[0], resultArray2[1]]
      }

      else if (resultArray1.length == 0) {
        resultArrays = [resultArray2[0], resultArray2[1], resultArray2[2]]
      }

      return resultArrays;

    }
  }

  async getMoodRecommendation(mood: string) {
    let select_sweet = false;
    let select_bitter = false;
    let select_refreshing = false;
    let select_clean = false;
    let select_cool = false;
    let select_sour = false;

    if (mood == 'joy') {
      select_sweet = true;
      select_refreshing = true;
      select_cool = true;
    }

    else if (mood == 'sad') {
      select_bitter = true;
      select_clean = true;
    }

    else if (mood == 'gloom') {
      select_sweet = true;
      select_bitter = true;
    }

    else if (mood = 'anger') {
      select_bitter = true;
      select_cool = true;
    }

    else if (mood == 'excited') {
      select_refreshing = true;
      select_cool = true;
      select_sour = true;
    }

    else if (mood == 'drink') {
      select_sweet = true;
      select_clean = true;
    }

    else if (mood == 'sentimental') {
      select_bitter = true;
      select_clean = true;
    }

    else if (mood == 'flutter') {
      select_sweet = true;
      select_refreshing = true;
      select_sour = true;
    }

    let resultArrays;

    const resultArray1 = await this.alcoholRepository
      .createQueryBuilder('query1')
      .where("query1.cool = :select_cool", { select_cool })
      .andWhere("query1.clean = :select_clean", { select_clean })
      .andWhere("query1.bitter = :select_bitter", { select_bitter })
      .andWhere("query1.sweet = :select_sweet", { select_sweet })
      .andWhere("query1.refreshing = :select_refreshing", { select_refreshing })
      .andWhere("query1.sour = :select_sour", { select_sour })
      .orderBy("RANDOM()")
      .getMany();


    if (resultArray1.length >= 3) {
      resultArrays = [resultArray1[0], resultArray1[1], resultArray1[2]]
      return resultArrays;
    }

    if (resultArray1.length < 3) {
      let resultArray2;

      if (mood == 'joy') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (mood == 'sad') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (mood == 'gloom') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (mood == 'anger') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (mood == 'excited') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .andWhere("query2.sour = :select_sour", { select_sour })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (mood = 'drink') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (mood = 'centimental') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (mood = 'flutter') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .andWhere("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.sour = :select_sour", { select_sour })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      if (resultArray1.length == 2) {
        resultArrays = [resultArray1[0], resultArray1[1], resultArray2[0]]
      }

      else if (resultArray1.length == 1) {
        resultArrays = [resultArray1[0], resultArray2[0], resultArray2[1]]
      }

      else if (resultArray1.length == 0) {
        resultArrays = [resultArray2[0], resultArray2[1], resultArray2[2]]
      }

      return resultArrays;
    }
  }

  async getEventRecommendation(event: string) {
    let select_sweet = false;
    let select_bitter = false;
    let select_refreshing = false;
    let select_clean = false;
    let select_cool = false;
    let select_sour = false;

    if (event == 'party') {
      select_bitter = true;
      select_clean = true;
      select_cool = true;
    }

    else if (event == 'festival') {
      select_sweet = true;
      select_refreshing = true;
      select_cool = true;
    }

    else if (event == 'athletic') {
      select_refreshing = true;
      select_sour = true;
    }

    else if (event == 'mt') {
      select_sweet = true;
      select_bitter = true;
      select_clean = true;
    }

    else if (event == 'test') {
      select_bitter = true;
      select_clean = true;
    }

    else if (event == 'homework') {
      select_bitter = true;
      select_clean = true;
      select_cool = true;
    }

    else if (event == 'meeting') {
      select_sweet = true;
      select_refreshing = true;
      select_sour = true;
    }

    else if (event == 'end') {
      select_sweet = true;
      select_clean = true;
      select_cool = true;
    }

    else if (event == 'travel') {
      select_sweet = true;
      select_refreshing = true;
      select_cool = true;
    }

    else if (event == 'picnic') {
      select_refreshing = true;
      select_cool = true;
      select_sour = true;
    }

    let resultArrays;

    const resultArray1 = await this.alcoholRepository
      .createQueryBuilder('query1')
      .where("query1.cool = :select_cool", { select_cool })
      .andWhere("query1.clean = :select_clean", { select_clean })
      .andWhere("query1.bitter = :select_bitter", { select_bitter })
      .andWhere("query1.sweet = :select_sweet", { select_sweet })
      .andWhere("query1.refreshing = :select_refreshing", { select_refreshing })
      .andWhere("query1.sour = :select_sour", { select_sour })
      .orderBy("RANDOM()")
      .getMany();


    if (resultArray1.length >= 3) {
      resultArrays = [resultArray1[0], resultArray1[1], resultArray1[2]]
      return resultArrays;
    }

    if (resultArray1.length < 3) {
      let resultArray2;

      if (event == 'party') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'festival') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'athletic') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.sour = :select_sour", { select_sour })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'mt') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'test') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'homework') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.cool = :select_cool", { select_cool })
          .andWhere("query2.bitter = :select_bitter", { select_bitter })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'meeting') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.sour = :select_sour", { select_sour })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'end') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .andWhere("query2.clean = :select_clean", { select_clean })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'travel') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.sweet = :select_sweet", { select_sweet })
          .andWhere("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      else if (event == 'picnic') {
        resultArray2 = await this.alcoholRepository
          .createQueryBuilder('query2')
          .where("query2.refreshing = :select_refreshing", { select_refreshing })
          .andWhere("query2.cool = :select_cool", { select_cool })
          .andWhere("query2.sour = :select_sour", { select_sour })
          .orderBy("RANDOM()")
          .getMany();
        resultArray2 = resultArray2.filter(i => !resultArray1.some(j => i.id === j.id));
      }

      if (resultArray1.length == 2) {
        resultArrays = [resultArray1[0], resultArray1[1], resultArray2[0]]
      }

      else if (resultArray1.length == 1) {
        resultArrays = [resultArray1[0], resultArray2[0], resultArray2[1]]
      }

      else if (resultArray1.length == 0) {
        resultArrays = [resultArray2[0], resultArray2[1], resultArray2[2]]
      }

      return resultArrays;
    }
  }
}