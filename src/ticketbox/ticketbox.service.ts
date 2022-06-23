import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/admin/question/entities/question.entity';
import { QuestionRepository } from 'src/admin/question/question.repository';
import { QuestionService } from 'src/admin/question/question.service';
import { Selection } from 'src/admin/selection/entities/selection.entity';
import { SelectionRepository } from 'src/admin/selection/selection.repository';
import { SelectionService } from 'src/admin/selection/selection.service';

@Injectable()
export class TicketboxService {
    constructor(
        @InjectRepository(QuestionRepository)
        @InjectRepository(SelectionRepository)
        private questionRepository: QuestionRepository,
        private selectionRepository: SelectionRepository,
        private questionService: QuestionService,
        private selectionService: SelectionService
    ){}

    async getTestByQuestionId(id:number) {
        return await this.selectionService.getSelectionById(id);
    }

    // 질문 조회
    async getQuestionById(id: number): Promise<Question> {
        const found = await this.questionRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }
        return found;
    }

    // 선택지 조회
    async getSelectionById(id: number): Promise<Selection> {
        const found = await this.selectionRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Cant't find question with id ${id}`);
        }

        return found;
    }

 
}