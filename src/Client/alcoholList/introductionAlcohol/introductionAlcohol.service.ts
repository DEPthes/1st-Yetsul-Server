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

    // 사용자가 술 찜했는지 확인하기
    async likeOrNot(userEmail: string, alcoholId: number) {

        const user = await this.userRepository.findOne({ // 사용자
            where: {
                email: userEmail
            }
        });

        const existLike = await this.likeRepository.findOne({
            where: {
                alcoholId: alcoholId,
                userId: user.id
            }
        });

        if (existLike) {
            return 'LIKE';
        } else {
            return 'NOT';
        }
    }

    // 찜하기
    async userLikedAlcohol(userEmail: string, alcoholId: number) {

        const user = await this.userRepository.findOne({ // 사용자
            where: {
                email: userEmail
            }
        });

        const alcohol = await this.alcoholRepository.findOne(alcoholId);


        const existLike = await this.likeRepository.findOne({
            where: {
                alcoholId: alcoholId,
                userId: user.id
            }
        });

        console.log(existLike);

        if (existLike) { // 이미 존재한다면 삭제
            console.log('이미 있는 값');
            await this.alcoholRepository.likeCountMinus(alcoholId); // 술 엔티티에 찜 카운트 감소시킴
            return await this.likeRepository.delete(existLike);
        }

        await this.alcoholRepository.likeCount(alcoholId); // 술 엔티티에 찜 카운트 증가시킴

        await this.likeRepository.saveUserLikedAlcohol(user, alcohol);

        return await this.alcoholRepository.findOne(alcoholId);
    }

    /*
    * @Description:술 카테고리 별 리스트 조회
    */
    async getAlcoholListByCategory(category: number, filter: string): Promise<Alcohol[]> {
        if (filter == 'ASC') {
            return await this.alcoholRepository.find({
                order: {
                    star: "ASC"
                },
                where: {
                    category: category
                }
            });
        }
        else if (filter == 'DESC') {
            return await this.alcoholRepository.find({
                order: {
                    star: "DESC"
                },
                where: {
                    category: category
                }
            });
        }
    }

    // id로 술 조회
    async getAlcoholById(id: number) {
        const alcohol = await this.alcoholRepository.findOne(id);

        if (!alcohol) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }

        // 해당 술 찜 몇명이 했는지
        const query = this.likeRepository.createQueryBuilder('like'); // 쿼리 사용
        query.where('like.alcoholId = :alcoholId', { alcoholId: id });
        const likes = await query.getMany(); // 전부 가져옴. getOne()은 하나

        // const likeCount = likes.length; // 해당 술에 달린 리뷰 수 카운트

        return alcohol;
    }

    // 이름으로 술 조회
    async getAlcoholByName(alcoholName: string) {
        const alcohol = await this.alcoholRepository.findOne({
            where: {
                AlcoholName: alcoholName
            }
        });

        if (!alcohol) {
            throw new NotFoundException(`Cant't find alcohol with name ${alcoholName}.`);
        }


        // const alcoholId = alcohol.id;


        // // 해당 술 찜 몇명이 했는지
        // const query = this.likeRepository.createQueryBuilder('like'); // 쿼리 사용
        // query.where('like.alcoholId = :alcoholId', { alcoholId: alcoholId });
        // const likes = await query.getMany(); // 전부 가져옴. getOne()은 하나

        // const likeCount = likes.length; // 해당 술에 달린 리뷰 수 카운트

        return alcohol;
    }
}
