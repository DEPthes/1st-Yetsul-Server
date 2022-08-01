import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDto } from '../../DTO/question.dto';
import { Question } from '../../Entity/box_office/question.entity';
import { QuestionRepository } from '../../Repository/question.repository';

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

    // 질문 조회
    async getQuestionById(id: string): Promise<Question> {
        const found = await this.questionRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }

        return found;
    }

  }
