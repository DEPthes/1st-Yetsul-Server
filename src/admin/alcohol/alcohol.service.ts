import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlcoholRepository } from './alcohol.repository';
import { AlcoholDto } from './dto/alcohol.dto';
import { Alcohol } from './entities/alcohol.entity';

@Injectable()
export class AlcoholService {

  constructor(
    @InjectRepository(AlcoholRepository)
    private alcoholRepository: AlcoholRepository,
){}

   // 술 리스트 조회
   async getAlcoholList(): Promise <Alcohol[]> {
    return await this.alcoholRepository.find();
}

// 술 조회
async getAlcoholById(id: number): Promise<Alcohol> {
    const found = await this.alcoholRepository.findOne(id);

    if (!found) {
        throw new NotFoundException(`Cant't find question with id ${id}`);
    }

    return found;
}
}
