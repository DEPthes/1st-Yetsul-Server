import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan } from "typeorm";
import { QuestionRepository } from 'src/admin/question/question.repository';
import { SelectionRepository } from 'src/admin/selection/selection.repository';
import { SelectionService } from 'src/admin/selection/selection.service';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
import { MovieRepository } from './movie/movie.repository';

@Injectable()
export class TicketboxService {
    constructor(
        @InjectRepository(QuestionRepository)
        @InjectRepository(SelectionRepository)
        @InjectRepository(AlcoholRepository)
        @InjectRepository(MovieRepository)
        private questionRepository: QuestionRepository,
        private selectionRepository: SelectionRepository,
        private alcoholRepository: AlcoholRepository,
        private movieRepository: MovieRepository,
        private selectionService: SelectionService
    ) { }

    // 답 1개와 그에 맞는 선택지들 가져오기
    async getTest(uuid: string) {

        const question = await this.questionRepository.findOne(uuid);
        const id = question.question_id;

        let selection;
        if (id == 7)
        {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: 13 }, { selection_id: 14 }, { selection_id: 15 }
                ]
            });
        }
        else if (id == 8)
        {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: 16 }, { selection_id: 17 }, { selection_id: 18 }
                ]
            });
        }
        else {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: id*2-1 }, { selection_id: id*2 }
                ]
            });
        }

        return [question, selection];
    }

    // 사용자의 선택지 인자로 받고 그에 해당하는 술 배열 반환
    async getResult(answer: string) { // 1111111
        if (answer[0] == '1' && answer[1] == '1') { // 주종
            if (answer[2] == '1') { // 도수
                if (answer[3] == '1') { // 청량감
                    if (answer[5] == '1') { // 맛
                        return await this.alcoholRepository.find({
                            where: [
                                { category: "카테고리1", AlcoholByVolume: LessThan(10),}
                            ]
                        });
                    }
                } else {

                }
            }
        }
    }

    // 선택지에 따른 영화 출력
    async getMovie(answer: string) { // 11111 (5자리)
        let start = 0; // [2,3,4,5,6,7]
        let end = 31;
        let mid;
        let index = 0;
        while(start <= end) { 
            mid = Math.floor((start + end) / 2);
            if(parseInt(answer[index]) % 2 == 1){ // 선택지 1 선택
                end = mid; // 1~16
            }

           else { // 선택지 2 선택
                start = mid+1; // 17~32 [2,2,2,2,1] mid 49/2=24
           }
           index += 1;
        }

        return await this.movieRepository.find({
            where: [
                { id: start}
            ]
        });
    }
}