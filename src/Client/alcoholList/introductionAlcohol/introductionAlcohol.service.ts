import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { LikeRepository } from 'src/Repository/like.repository';
import { S3Repository } from 'src/Repository/s3.repository';
import { S3 } from '../../../Entity/s3.entity';

@Injectable()
export class IntroductionAlcoholService {

    constructor(
        @InjectRepository(AlcoholRepository)
        @InjectRepository(LikeRepository)
        @InjectRepository(UserRepository)
        @InjectRepository(S3Repository)
        private alcoholRepository: AlcoholRepository,
        private likeRepository: LikeRepository,
        private userRepository: UserRepository,
        private s3Repository: S3Repository
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

    // // 사용자가 술 찜했는지 확인하기 (사용자 정보 이메일로 받음)
    // async likeOrNot(userEmail: string, alcoholId: number) {

    //     const user = await this.userRepository.findOne({ // 사용자
    //         where: {
    //             email: userEmail
    //         }
    //     });

    //     const existLike = await this.likeRepository.findOne({
    //         where: {
    //             alcoholId: alcoholId,
    //             userId: user.id
    //         }
    //     });

    //     if (existLike) {
    //         return 'LIKE';
    //     } else {
    //         return 'NOT';
    //     }
    // }

    // 사용자가 술 찜했는지 확인하기 (사용자 정보 아이디로 받음 - 토큰)
    async likeOrNot(userId: number, alcoholId: number) {

        const user = await this.userRepository.findOne({ // 사용자
            where: {
                id: userId
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

    // // 찜하기 (이메일로)
    // async userLikedAlcohol(userEmail: string, alcoholId: number) {

    //     const user = await this.userRepository.findOne({ // 사용자
    //         where: {
    //             email: userEmail
    //         }
    //     });

    //     const alcohol = await this.alcoholRepository.findOne(alcoholId);


    //     const existLike = await this.likeRepository.findOne({
    //         where: {
    //             alcoholId: alcoholId,
    //             userId: user.id
    //         }
    //     });

    //     console.log(existLike);

    //     if (existLike) { // 이미 존재한다면 삭제
    //         console.log('이미 있는 값');
    //         await this.alcoholRepository.likeCountMinus(alcoholId); // 술 엔티티에 찜 카운트 감소시킴
    //         await this.likeRepository.delete(existLike);
    //     } else { // 찜 한적 없다면

    //         await this.alcoholRepository.likeCount(alcoholId); // 술 엔티티에 찜 카운트 증가시킴
    //         await this.likeRepository.saveUserLikedAlcohol(user, alcohol);
    //     }
    //     return await this.alcoholRepository.findOne(alcoholId);
    // }

    // 찜하기 (아이디로, 토큰)
    async userLikedAlcohol(userId: number, alcoholId: number) {

        const user = await this.userRepository.findOne({ // 사용자
            where: {
                id: userId
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
            await this.likeRepository.delete(existLike);
        } else { // 찜 한적 없다면

            await this.alcoholRepository.likeCount(alcoholId); // 술 엔티티에 찜 카운트 증가시킴
            await this.likeRepository.saveUserLikedAlcohol(user, alcohol);
        }
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


    // 술 사진 등록
    async putAlcoholImage(alcohol_id: number, files: Express.Multer.File[], location) {


        const uploadFiles = [];
        const url = []; // 이미지 url을 배열로, 사진 여러장 담을 수 있도록
        for (const element in files) { // 파일 개수만큼 반복 돌리면서 url 넣기
            const file = new S3();
            file.originalName = files[element].originalname;
            file.url = location[element].location;
            url.push(file.url); // url 배열에 넣기
            uploadFiles.push(file); // S3 레포지토리에 저장 할 파일
        }

        await this.s3Repository.save(uploadFiles); // 파일 저장
        await this.alcoholRepository.putAlcoholImage(alcohol_id, url); // 알콜 레파지토리에 저장
    }
}