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
        private selectionService: SelectionService
    ) { }

    // 답 1개, 선택지 2개 가져오기, 7,8번은 답안 3,4개 이므로 예외
    async getTest(id: string) {
        let sel;
        if (id == '7')
        {
            sel = await this.selectionRepository.find({
                where: [
                    { selection_id: 13 }, { selection_id: 14 }, { selection_id: 15 }
                ]
            });
        }
        else if (id == '8')
        {
            sel = await this.selectionRepository.find({
                where: [
                    { selection_id: 16 }, { selection_id: 17 }, { selection_id: 18 }
                ]
            });
        }
        else {
            sel = await this.selectionRepository.find({
                where: [
                    { selection_id: parseInt(id)*2-1 }, { selection_id: parseInt(id)*2 }
                ]
            });
        }

        const que = await this.questionRepository.findOne(id);

        return [sel, que];
    }
}