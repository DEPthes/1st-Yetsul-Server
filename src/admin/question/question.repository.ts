import { EntityRepository, Repository } from "typeorm";
import { QuestionDto } from "./dto/question.dto";
import { Question } from "./entities/question.entity";

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
    async createQuestion(questionDto: QuestionDto): Promise<Question> {
        const { questionContent } = questionDto;
        const question = this.create({ questionContent });

        await this.save(question);

        return question;
    } 

  
}