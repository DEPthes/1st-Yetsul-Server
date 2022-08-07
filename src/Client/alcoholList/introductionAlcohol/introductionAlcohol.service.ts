import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { LikeRepository } from 'src/Repository/like.repository';

@Injectable()
export class IntroductionAlcoholService {

    constructor(
        @InjectRepository(AlcoholRepository)
        @InjectRepository(LikeRepository)
        @InjectRepository(UserRepository)
        private alcoholRepository: AlcoholRepository,
        private likeRepository: LikeRepository,
        private userRepository: UserRepository,
    ) { }

    // 술 리스트 전체 조회
    async getAlcoholList(filter: string): Promise<Alcohol[]> {
        if (filter == 'ASC') {
            return await this.alcoholRepository.find({
                order: { star: "ASC" }
            });
        }
        else if (filter == 'DESC') {
            return await this.alcoholRepository.find({
                order: { star: "DESC" }
            });
        }
        return await this.alcoholRepository.find();
    }

    // 찜하기
    async userLikedAlcohol(userEmail: string, alcoholId: number) {

        const user = await this.userRepository.findOne({
            where: {
                email: userEmail
            }
        });
        console.log(user.email);
        console.log(user.nickname);
        const alcohol = await this.alcoholRepository.findOne(alcoholId);
        return this.likeRepository.saveUserLikedAlcohol(user, alcohol);
    }

    /*
    * @Description:술 카테고리 별 리스트 조회
    */
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

    // id로 술 조회
    async getAlcoholById(id: number): Promise<Alcohol> {
        const found = await this.alcoholRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }

        return found;
    }

    // 이름으로 술 조회
    async getAlcoholByName(alcoholName: string): Promise<Alcohol> {
        const found = await this.alcoholRepository.findOne({
            where: {
                AlcoholName: alcoholName
            }
        });

        if (!found) {
            throw new NotFoundException(`Cant't find alcohol with name ${alcoholName}.`);
        }

        return found;
    }
}
