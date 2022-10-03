import { Controller, Get } from '@nestjs/common';
import { Question } from '../../Entity/box_office/question.entity';
import { QuestionService } from './question.service';

@Controller("question")
export class QuestionController {
    constructor(private questionService: QuestionService) { }

    @Get()
    getQuestionList(): Promise<Question[]> {
        return this.questionService.getQuestionList();
    }
  }