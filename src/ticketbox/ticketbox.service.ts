import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRepository } from 'src/admin/question/question.repository';
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

    // 답 1개와 그에 맞는 선택지들 가져오기
    async getTest(uuid: string) {

        const que = await this.questionRepository.findOne(uuid);

        const id = que.question_id;

        let sel;
        if (id == 7)
        {
            sel = await this.selectionRepository.find({
                where: [
                    { selection_id: 13 }, { selection_id: 14 }, { selection_id: 15 }
                ]
            });
        }
        else if (id == 8)
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
                    { selection_id: id*2-1 }, { selection_id: id*2 }
                ]
            });
        }

        return [sel, que];
    }
}