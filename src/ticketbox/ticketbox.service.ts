import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDto } from './dto/question.dto';
import { SelectionDto } from './dto/selection.dto';
import { Question } from './entities/question.entity';
import { Selection } from './entities/selection.entity';
import { QuestionRepository } from './question.repository';
import { SelectionRepository } from './selection.repository';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionRepository)
        @InjectRepository(SelectionRepository)
        private questionRepository: QuestionRepository,
        private selectionRepository: SelectionRepository,
    ){}

    // 작품 리스트 조회
    async getQuestionList(): Promise <Question[]> {
        return await this.questionRepository.find();
    }

    // 작품 업로드
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

    ////////////// 답안

    // 답안 리스트 조회
    async getSelectionList(): Promise <Selection[]> {
        return await this.selectionRepository.find();
    }

    // 답안 업로드
    async uploadSelection(selectionDto: SelectionDto): Promise<Selection> {
        return this.selectionRepository.uploadSelection(selectionDto);
    }

    // 답안 조회
    async getSelectionById(id: number): Promise<Selection> {
        const found = await this.selectionRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }

        return found;
    }

    // 답안 수정
    async updateSelection(id: number, newSelection: SelectionDto): Promise<Selection> {
        return this.selectionRepository.updateSelection(id, newSelection);
    }

    // 답안 삭제
    async deleteSelection(id: number): Promise<void> {
        const result = await this.selectionRepository.delete(id);
        console.log(result);
    }
}
