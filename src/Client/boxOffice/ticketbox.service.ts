import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRepository } from 'src/Repository/question.repository';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { MovieRepository } from '../../Repository/movie.repository';
import { QuestionAndSelectionDto } from '../../DTO/questionAndSelection.dto';
import { SelectionRepository } from 'src/Repository/selection.repository';
import { IntroductionAlcoholService } from '../alcoholList/introductionAlcohol/introductionAlcohol.service';

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
        private alcoholService: IntroductionAlcoholService
    ) { }

    /* Method
        1. getResult(): 매표소 결과 출력
        2. getTest(): 매표소 모든 테스트 객체 출력
        3. getResultAlcohol()
        4. getResultMovie()
    */

    // 선택지에 따른 영화+술 결과 출력
    async getResult(resultCombination: string): Promise<any> {
        
        const getResultMovie = await this.getResultMovie(resultCombination); // 영화 결과
        const movieAlcoholId = getResultMovie[0].alcohol; // 영화에 매치된 술 id
        const movieAlcohol = await this.alcoholService.getAlcoholById(movieAlcoholId); // 영화에 매치된 술

        let getResultAlcohol = await this.getResultAlcohol(resultCombination); // 술 결과

        try {
            // 매칭 술이 랜덤 술에 포함된다면 반복문
            // for문으로 전체 체크해야 함.
            while (getResultAlcohol[0].id == movieAlcohol.id || getResultAlcohol[1].id == movieAlcohol.id) {
                getResultAlcohol = await this.getResultAlcohol(resultCombination);
            }

            // 2122231 일때 187 그대로 나옴. 왜??
            // for (let i=0; i<getResultAlcohol.length; i++) {
            //     if (getResultAlcohol[i].id == movieAlcohol.id) { 
            //         getResultAlcohol = await this.getResultAlcohol(resultCombination);
            //     }
            // }

            // console.log(getResultAlcohol[0].id == movieAlcohol.id);
            // console.log(getResultAlcohol[1].id == movieAlcohol.id);

            return [getResultMovie, movieAlcohol, getResultAlcohol];
        } catch (err) {
            console.log('결과값이 없습니다.', err);
            throw new NotFoundException;
        }
    }

    async getTest(questionAndSelectionDto: QuestionAndSelectionDto) {

        let { question, selection1, selection2, selection3 } = questionAndSelectionDto;
        const test = [];

        for (let questionID = 1; questionID <= 8; questionID++) { //질문지 1번부터 8번까지 객체 생성
            // console.log(questionID);

            question = await (await (await this.questionRepository.findOne(questionID))).questionContent;

            if (questionID == 7) {
                selection1 = await (await this.selectionRepository.findOne(13)).selectionContent;
                selection2 = await (await this.selectionRepository.findOne(14)).selectionContent;
                selection3 = await (await this.selectionRepository.findOne(15)).selectionContent;
            }

            else if (questionID == 8) {
                selection1 = await (await this.selectionRepository.findOne(16)).selectionContent;
                selection2 = await (await this.selectionRepository.findOne(17)).selectionContent;
                selection3 = await (await this.selectionRepository.findOne(18)).selectionContent;
            }
            else {
                selection1 = await (await this.selectionRepository.findOne(questionID * 2 - 1)).selectionContent;
                selection2 = await (await this.selectionRepository.findOne(questionID * 2)).selectionContent;
                selection3 = null;
            }
            //test.push(questionAndSelectionDto);
            test.push({ questionID, question, selection1, selection2, selection3 });
        }

        return test;
    }


    // 전체 id만 나오는 !!
    // 사용자의 선택지 인자로 받고 그에 해당하는 술 배열 반환
    // 참조: https://www.kindacode.com/article/typeorm-and-or-operators/#AND_operator
    async getResultAlcoholAll(resultCombination: string) { // 1111111 이중에서 5번째, 7번째는 안쓰임

        //let select_alcoholByVolume = MoreThan(10);
        let select_alcoholByVolume1 = 10.0;
        let select_alcoholByVolume2 = 100.0;
        let select_cool = Boolean(true);
        let select_clean = false;
        let select_bitter = false;
        let select_sweet = false;
        let select_sour = false;

        let select_categoryId = [1, 2, 3, 4, 5, 6];

        for (let index = 0; index < 6; index++) {

            if (index == 0) { // 1번 문제
                if (parseInt(resultCombination[index]) == 1) { // 1번문제 답이 1이면
                    select_categoryId.splice(2, 4); // 탁주 과실주 // [1,2] -> 1

                } else {  // 1번문제 답이 2이면
                    select_categoryId.splice(0, 2) // 약주 청주 증류주 리큐르주 [3,4,5,6] ->34, 56
                }
            }
            else if (index == 1 || select_categoryId.length == 2) { // 1번문제 답을 1로 선택하고
                if (parseInt(resultCombination[index]) == 1) { // 2번문제 답이 1일때
                    select_categoryId.pop(); // 탁주 과실주 // select_categoryId = [1] // 11이면 탁주
                }
                else { // 2번문제 답이 2일때
                    select_categoryId.splice(0, 1); // 탁주 과실주 // select_categoryId = [2] // 12면 과실주
                }
            }
            else if (index == 1 || select_categoryId.length == 4) { // 1번문제 답을 2로 선택하고
                if (parseInt(resultCombination[index]) == 1) { // 2번문제 답이 1일때
                    select_categoryId.pop();
                    select_categoryId.pop(); // 약주, 청주 // select_categoryId = [3,4]
                }
                else { // 2번문제 답이 2일때
                    select_categoryId.splice(0, 2); // 증류주, 리큐르주 // select_categoryId = [5,6]
                }
            }

            else if (index == 2) {
                if (resultCombination[index] == '1') { // 3번째 문제 답 1이면 10도 미만
                    //select_alcoholByVolume = LessThan(10);
                    select_alcoholByVolume1 = 0.0;
                    select_alcoholByVolume2 = 21.0;
                }
            }

            else if (index == 3) { // 4번째 문제 답 2면 청량감 없음
                if (resultCombination[index] == '2') {
                    select_cool = Boolean(false);
                }
            }

            else if (index == 5) { // 6번째 문제
                if (resultCombination[index] == '1') { // 답 1이면 깔끔함, 쓴맛 있음
                    select_clean = true;
                    // select_bitter = true;
                } else if (resultCombination[index] == '2') { // 답 2면 단맛 있음
                    select_sweet = true;
                } else {  // 답 3이면 신맛 있음
                    select_sour = true;
                }
            }
        }

        let resultArray = await this.alcoholRepository
            .createQueryBuilder('todo')
            .where("todo.category IN (:...categories)", { categories: select_categoryId })
            .andWhere('todo.AlcoholByVolume >= :select_alcoholByVolume1', { select_alcoholByVolume1 }) // 10
            .andWhere('todo.AlcoholByVolume < :select_alcoholByVolume2', { select_alcoholByVolume2 }) // 20
            .andWhere("todo.cool = :select_cool", { select_cool })
            .andWhere("todo.clean = :select_clean", { select_clean })
            .andWhere("todo.bitter = :select_bitter", { select_bitter })
            .andWhere("todo.sweet = :select_sweet", { select_sweet })
            .andWhere("todo.sour = :select_sour", { select_sour })
            .orderBy("RANDOM()")
            .getMany();

        let addArray;
        if (resultArray.length < 2) { // 0,1개라면

            addArray = await this.alcoholRepository
                .createQueryBuilder('todo')
                .where("todo.category IN (:...categories)", { categories: select_categoryId })
                .andWhere("todo.cool = :select_cool", { select_cool })
                // .andWhere("todo.clean = :select_clean", { select_clean })
                // .andWhere("todo.bitter = :select_bitter", { select_bitter })
                // .andWhere("todo.sweet = :select_sweet", { select_sweet })
                .andWhere("todo.sour = :select_sour", { select_sour })
                .orderBy("RANDOM()")
                .getMany();

        }
        const finalresultArray = resultArray.concat(addArray);

        if (finalresultArray[1] == null) { // 0개 나올 시 다음 조합 (1111 -> 1112)의 결과 나오도록.
            let first = resultCombination.substring(0, 3);

            let middle = '2';

            let last = resultCombination.substring(4);

            let fixedId = first + middle + last;
            console.log(fixedId);
            resultCombination = fixedId; // 이 값 가지고 다시 돌려야 함.
            return await this.getResultAlcoholAll(resultCombination);
        }
        else 
        {
            let arrxx = [];
            // for (let i=0; i<finalresultArray.length-1; i++)
            for (let i=0; i<2; i++)
            {
                arrxx.push(finalresultArray[i]['id'])
            }
            return arrxx;
            // return arrxx.length;
        }
    }

    
    // 하나만 나오는 !
    async getResultAlcohol(resultCombination: string) { // 1111111 이중에서 5번째, 7번째는 안쓰임

        //let select_alcoholByVolume = MoreThan(10);
        let select_alcoholByVolume1 = 10.0;
        let select_alcoholByVolume2 = 100.0;
        let select_cool = Boolean(true);
        let select_clean = false;
        let select_bitter = false;
        let select_sweet = false;
        let select_sour = false;

        let select_categoryId = [1, 2, 3, 4, 5, 6];

        for (let index = 0; index < 6; index++) {

            if (index == 0) { // 1번 문제
                if (parseInt(resultCombination[index]) == 1) { // 1번문제 답이 1이면
                    select_categoryId.splice(2, 4); // 탁주 과실주 // [1,2] -> 1

                } else {  // 1번문제 답이 2이면
                    select_categoryId.splice(0, 2) // 약주 청주 증류주 리큐르주 [3,4,5,6] ->34, 56
                }
            }
            else if (index == 1 || select_categoryId.length == 2) { // 1번문제 답을 1로 선택하고
                if (parseInt(resultCombination[index]) == 1) { // 2번문제 답이 1일때
                    select_categoryId.pop(); // 탁주 과실주 // select_categoryId = [1] // 11이면 탁주
                }
                else { // 2번문제 답이 2일때
                    select_categoryId.splice(0, 1); // 탁주 과실주 // select_categoryId = [2] // 12면 과실주
                }
            }
            else if (index == 1 || select_categoryId.length == 4) { // 1번문제 답을 2로 선택하고
                if (parseInt(resultCombination[index]) == 1) { // 2번문제 답이 1일때
                    select_categoryId.pop();
                    select_categoryId.pop(); // 약주, 청주 // select_categoryId = [3,4]
                }
                else { // 2번문제 답이 2일때
                    select_categoryId.splice(0, 2); // 증류주, 리큐르주 // select_categoryId = [5,6]
                }
            }

            else if (index == 2) {
                if (resultCombination[index] == '1') { // 3번째 문제 답 1이면 10도 미만
                    //select_alcoholByVolume = LessThan(10);
                    select_alcoholByVolume1 = 0.0;
                    select_alcoholByVolume2 = 21.0;
                }
            }

            else if (index == 3) { // 4번째 문제 답 2면 청량감 없음
                if (resultCombination[index] == '2') {
                    select_cool = Boolean(false);
                }
            }

            else if (index == 5) { // 6번째 문제
                if (resultCombination[index] == '1') { // 답 1이면 깔끔함, 쓴맛 있음
                    select_clean = true;
                    // select_bitter = true;
                } else if (resultCombination[index] == '2') { // 답 2면 단맛 있음
                    select_sweet = true;
                } else {  // 답 3이면 신맛 있음
                    select_sour = true;
                }
            }
        }

        let resultArray = await this.alcoholRepository
            .createQueryBuilder('todo')
            .where("todo.category IN (:...categories)", { categories: select_categoryId })
            .andWhere('todo.AlcoholByVolume >= :select_alcoholByVolume1', { select_alcoholByVolume1 }) // 10
            .andWhere('todo.AlcoholByVolume < :select_alcoholByVolume2', { select_alcoholByVolume2 }) // 20
            .andWhere("todo.cool = :select_cool", { select_cool })
            .andWhere("todo.clean = :select_clean", { select_clean })
            .andWhere("todo.bitter = :select_bitter", { select_bitter })
            .andWhere("todo.sweet = :select_sweet", { select_sweet })
            .andWhere("todo.sour = :select_sour", { select_sour })
            .orderBy("RANDOM()")
            .getMany();

        let addArray;
        if (resultArray.length < 2) { // 0,1개라면

            addArray = await this.alcoholRepository
                .createQueryBuilder('todo')
                .where("todo.category IN (:...categories)", { categories: select_categoryId })
                .andWhere("todo.cool = :select_cool", { select_cool })
                // .andWhere("todo.clean = :select_clean", { select_clean })
                // .andWhere("todo.bitter = :select_bitter", { select_bitter })
                // .andWhere("todo.sweet = :select_sweet", { select_sweet })
                .andWhere("todo.sour = :select_sour", { select_sour })
                .orderBy("RANDOM()")
                .getMany();

        }
        const finalresultArray = resultArray.concat(addArray);

        if (finalresultArray[1] == null) { // 0개 나올 시 다음 조합 (1111 -> 1112)의 결과 나오도록.
            let first = resultCombination.substring(0, 3);

            let middle = '2';

            let last = resultCombination.substring(4);

            let fixedId = first + middle + last;
            console.log(fixedId);
            resultCombination = fixedId; // 이 값 가지고 다시 돌려야 함.
            return await this.getResultAlcohol(resultCombination);
        }
        else 
        {
            // return finalresultArray;
            return [finalresultArray[0], finalresultArray[1]];
        }
    }

    // 선택지에 따른 영화 출력
    async getResultMovie(resultCombination: string) { // 11111 (5자리)

        let start = 0; // [2,3,4,5,6,7]
        let end = 31;
        let mid;
        let index = 0;
        while (start <= end) {
            mid = Math.floor((start + end) / 2);

            if (parseInt(resultCombination[index]) % 2 == 1) { // 선택지 1 선택
                end = mid; // 1~16
            }

            else { // 선택지 2 선택
                start = mid + 1; // 17~32 [2,2,2,2,1] mid 49/2=24
            }
            index += 1;
        }

        return await this.movieRepository.find({ where: { id: start } });
    }
}