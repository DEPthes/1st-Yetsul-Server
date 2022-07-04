import { Injectable, NotFoundException, ParseBoolPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, LessThan, MoreThan } from "typeorm";
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
        const question_id = question.question_id;

        let selection;

        if (question_id == 7) {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: 13 },
                    { selection_id: 14 },
                    { selection_id: 15 }
                ]
            });
        }

        else if (question_id == 8) {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: 16 },
                    { selection_id: 17 },
                    { selection_id: 18 }
                ]
            });
        }
        else {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: question_id * 2 - 1 }, { selection_id: question_id * 2 }
                ]
            });
        }

        return [question, selection];
    }

    // 사용자의 선택지 인자로 받고 그에 해당하는 술 배열 반환
    // 참조: https://www.kindacode.com/article/typeorm-and-or-operators/#AND_operator
    async getResult(answer: string) { // 1111111 이중에서 5번째, 7번째는 안쓰임
        //let select_alcoholByVolume = MoreThan(10);
        let select_alcoholByVolume1 = 10;
        let select_alcoholByVolume2 = 100;
        let select_cool = Boolean(true);
        let select_clean = false;
        let select_bitter = false;
        let select_sweet = false;
        let select_sour = false;

        let select_categoryId = [1, 2, 3, 4, 5, 6];

        for (let index = 0; index < 6; index++) {


            if (index == 0) { // 1번 문제
                if (parseInt(answer[index]) == 1) { // 1번문제 답이 1이면
                    select_categoryId.splice(2, 4); // 탁주 과실주 // [1,2] -> 1

                } else {  // 1번문제 답이 2이면
                    select_categoryId.splice(0, 2) // 약주 청주 증류주 리큐르주 [3,4,5,6] ->34, 56
                }
            }
            else if (index == 1 || select_categoryId.length == 2) { // 1번문제 답을 1로 선택하고
                if (parseInt(answer[index]) == 1) { // 2번문제 답이 1일때
                    select_categoryId.pop(); // 탁주 과실주 // select_categoryId = [1]
                }
                else { // 2번문제 답이 2일때
                    select_categoryId.splice(0, 1); // 탁주 과실주 // select_categoryId = [2]
                }
            }
            else if (index == 1 || select_categoryId.length == 4) { // 1번문제 답을 2로 선택하고
                if (parseInt(answer[index]) == 1) { // 2번문제 답이 1일때
                    select_categoryId.pop();
                    select_categoryId.pop(); // 약주, 청주 // select_categoryId = [3,4]
                }
                else { // 2번문제 답이 2일때
                    select_categoryId.splice(0, 2); // 증류주, 리큐르주 // select_categoryId = [5,6]
                }
            }

            else if (index == 2) {
                if (answer[index] == '1') { // 3번째 문제 답 2이면 10도 미만
                    //select_alcoholByVolume = LessThan(10);
                    select_alcoholByVolume1 = 0;
                    select_alcoholByVolume2 = 10;
                }
            }

            else if (index == 3) {
                if (answer[index] == '2') {
                    select_cool = Boolean(false);
                }
            }

            else if (index == 5) {
                if (answer[index] == '1') {
                    select_clean = true;
                    select_bitter = true;
                } else if (answer[index] == '2') {
                    select_sweet = true;
                } else {
                    select_sour = true;
                }
            }
        }

        // return await this.alcoholRepository.find({
        //     order:{
        //         //id: "ASC"
        //     },
        //     where: [
        //         {
        //             category: select_categoryId[0],
        //             AlcoholByVolume: select_alcoholByVolume,
        //             cool: select_cool,
        //             clean: select_clean,
        //             bitter: select_bitter,
        //             sweet: select_sweet,
        //             sour: select_sour
        //         },
        //         {
        //             category: select_categoryId[1],
        //             AlcoholByVolume: select_alcoholByVolume,
        //             cool: select_cool,
        //             clean: select_clean,
        //             bitter: select_bitter,
        //             sweet: select_sweet,
        //             sour: select_sour
        //         }
        //     ]
        // })

        const resultArray = await this.alcoholRepository
        .createQueryBuilder('todo')
        .where("todo.category IN (:...categories)", {categories: select_categoryId})
        .andWhere('todo.AlcoholByVolume >= :select_alcoholByVolume1', {select_alcoholByVolume1})
        .andWhere('todo.AlcoholByVolume < :select_alcoholByVolume2', {select_alcoholByVolume2})
        .andWhere("todo.cool = :select_cool", {select_cool})
        .andWhere("todo.clean = :select_clean", {select_clean})
        .andWhere("todo.bitter = :select_bitter", {select_bitter})
        .andWhere("todo.sweet = :select_sweet", {select_sweet})
        .andWhere("todo.sour = :select_sour", {select_sour})
        .orderBy("RANDOM()")
        .getMany();

        return [resultArray[0], resultArray[1]];
    }

    // 선택지에 따른 영화 출력
    async getMovie(answer: string) { // 11111 (5자리)
        let start = 0; // [2,3,4,5,6,7]
        let end = 31;
        let mid;
        let index = 0;
        while (start <= end) {
            mid = Math.floor((start + end) / 2);

            if (parseInt(answer[index]) % 2 == 1) { // 선택지 1 선택
                end = mid; // 1~16
            }

            else { // 선택지 2 선택
                start = mid + 1; // 17~32 [2,2,2,2,1] mid 49/2=24
            }
            index += 1;
        }

        return await this.movieRepository.find({ where: [{ id: start }] });
    }
}