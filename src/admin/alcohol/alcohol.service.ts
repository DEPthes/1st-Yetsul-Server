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
    ) { }

    // 술 리스트 조회
    async getAlcoholList(filter: string): Promise<Alcohol[]> {
        if (filter == 'ASC') {
            return await this.alcoholRepository.find({
                order: {
                    star: "ASC"
                }
            });
        }
        else if (filter == 'DESC') {
            return await this.alcoholRepository.find({
                order: {
                    star: "DESC"
                }
            });
        }
        return await this.alcoholRepository.find();
    }

    // 술 카테고리 별 리스트 조회
    async getAlcoholListByCategory(id: number, filter: string): Promise<Alcohol[]> {
        if (filter == 'ASC') {
            return await this.alcoholRepository.find({
                order: {
                    star: "ASC"
                }
            });
        }
        else if (filter == 'DESC') {
            return await this.alcoholRepository.find({
                order: {
                    star: "DESC"
                }
            });
        }
        return await this.alcoholRepository.find({
            where: {
                category: id
            }
        });
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
