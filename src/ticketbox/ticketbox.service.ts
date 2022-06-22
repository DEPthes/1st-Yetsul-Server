import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDto } from './dto/question.dto';
import { SelectionDto } from './dto/selection.dto';
import { Alcohol } from './entities/alcohol.entity';
import { Question } from './entities/question.entity';
import { Selection } from './entities/selection.entity';
import { QuestionRepository } from './question.repository';
import { SelectionRepository } from './selection.repository';
import { AlcoholRepository } from './alcohol.repository';

@Injectable()
export class TicketboxService {
    constructor(
        @InjectRepository(QuestionRepository)
        @InjectRepository(SelectionRepository)
        @InjectRepository(AlcoholRepository)
        private questionRepository: QuestionRepository,
        private selectionRepository: SelectionRepository,
        private alcoholRepository: AlcoholRepository,
    ){}

    // 질문 리스트 조회
    async getQuestionList(): Promise <Question[]> {
        return await this.questionRepository.find();
    }

    // 질문 업로드
    async uploadQuestion(questionDto: QuestionDto): Promise<Question> {
        return this.questionRepository.uploadQuestion(questionDto);
    }

    // 질문 조회
    async getQuestionById(id: number): Promise<Question> {
        const found = await this.questionRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }

        return found;
    }

    // 질문 수정
    async updateQuestion(id: number, newQuestion: QuestionDto): Promise<Question> {
        return this.questionRepository.updateQuestion(id, newQuestion);
    }

    // 질문 삭제
    async deleteQuestion(id: number): Promise<void> {
        const result = await this.questionRepository.delete(id);
        console.log(result);
    }


    // 선택지 리스트 조회
    async getSelectionList(): Promise <Selection[]> {
        return await this.selectionRepository.find();
    }

    // 선택지 업로드
    async uploadSelection(selectionDto: SelectionDto): Promise<Selection> {
        return this.selectionRepository.uploadSelection(selectionDto);
    }

    // 선택지 조회
    async getSelectionById(id: number): Promise<Selection> {
        const found = await this.selectionRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }

        return found;
    }

    // 선택지 수정
    async updateSelection(id: number, newSelection: SelectionDto): Promise<Selection> {
        return this.selectionRepository.updateSelection(id, newSelection);
    }

    // 선택지 삭제
    async deleteSelection(id: number): Promise<void> {
        const result = await this.selectionRepository.delete(id);
        console.log(result);
    }


    /////// 술

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
