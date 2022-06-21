import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/question/create-question.dto';

@Injectable()
export class QuestionService {
  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  // update(id: number, updateQuestionDto: UpdateQuestionDto) {
  //   return `This action updates a #${id} question`;
  // }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
