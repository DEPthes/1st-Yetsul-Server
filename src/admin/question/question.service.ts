import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDto } from './dto/question.dto';
import { Question } from './entities/question.entity';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionRepository)
        private questionRepository: QuestionRepository,
    ){}

    // 질문 리스트 조회
    async getQuestionList(): Promise <Question[]> {
        return await this.questionRepository.find();
    }

    // 질문 업로드
    async createQuestion(questionDto: QuestionDto): Promise<Question> {
        return this.questionRepository.createQuestion(questionDto);
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
  }
