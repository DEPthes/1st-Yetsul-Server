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
        const question_id = question.question_id;

        let selection;

        if (question_id == 7){
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: 13 }, 
                    { selection_id: 14 }, 
                    { selection_id: 15 }
                ]
            });}

        else if (question_id == 8) {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: 16 }, 
                    { selection_id: 17 }, 
                    { selection_id: 18 }
                ]
            });}
        else {
            selection = await this.selectionRepository.find({
                where: [
                    { selection_id: question_id*2-1 }, { selection_id: question_id*2 }
                ]
            });
        }

        return [question, selection];
    }

    // 사용자의 선택지 인자로 받고 그에 해당하는 술 배열 반환
    // 참조: https://www.kindacode.com/article/typeorm-and-or-operators/#AND_operator
    async getResult(answer: string) { // 1111111 
        let select_alcoholByVolume = true;
        let select_cool = true;
        let select_clean = true;
        let select_bitterAndSweet = true;
        let select_sour = true;
        
        for(let index = 0; index < answer.length; index++) {
            
            let select_categoryId = [1,2,3,4,5,6];
            if(index === 0){ // 1번 문제
                if(parseInt(answer[index])  % 2 == 1){
                    select_categoryId.splice(2, 4); // 탁주 과실주 // [1,2] -> 1
                
                } else{
                    select_categoryId.splice(0, 2) // 약주 청주 증류주 리큐르주 [3,4,5,6] ->34, 56
                }
            }
            else if(index === 1 || select_categoryId.length == 2){
                if(parseInt(answer[index])  % 2 == 1){
                    select_categoryId.pop(); // 탁주 과실주 // [2] -> 1 // 21 => 3456
                }
                else{
                    select_categoryId.splice(0,1); // 탁주 과실주 // [1] -> 1
                }
            }
            else if(index === 1 || select_categoryId.length == 4){
                if(parseInt(answer[index])  % 2 == 1){
                    select_categoryId.pop();  
                    select_categoryId.pop(); // 탁주 과실주 // [2] -> 1 // 21 => 34
                }
                else{
                    select_categoryId.splice(2,2); // 탁주 과실주 //5,6
                }
            }

        return await this.alcoholRepository.find({where: {
            
            categoryID: select_categoryId[0],
            alcoholByVolume : select_alcoholByVolume,
            cool : select_cool,
            clean : select_clean,
            bitter : select_bitterAndSweet,
            sweet : select_bitterAndSweet,
            sour : select_sour,
        }})
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

        return await this.movieRepository.find({where: [{ id: start}]});
    }
}