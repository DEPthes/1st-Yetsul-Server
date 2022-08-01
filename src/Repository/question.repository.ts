import { EntityRepository, Repository } from "typeorm";
import { QuestionDto } from "../DTO/question.dto";
import { Question } from "../Entity/box_office/question.entity";

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
    async createQuestion(questionDto: QuestionDto): Promise<Question> {
        const { questionContent } = questionDto;
        const question = this.create({ questionContent });

        await this.save(question);

        return question;
    } 

  
}