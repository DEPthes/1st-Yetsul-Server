import { EntityRepository, Repository } from "typeorm";
import { QuestionDto } from "./dto/question.dto";
import { Question } from "./entities/question.entity";

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {

    // 작품 업로드
    async uploadQuestion(questionDto: QuestionDto): Promise<Question> {

        const {questionContent} = questionDto;

        const question = this.create({
            questionContent
        })

        await this.save(question);

        return question;
    }

    // 질문 수정
    async updateQuestion(id: number, newQuestion: QuestionDto): Promise<Question> {

        const questionToUpdate = await this.findOne(id);
        questionToUpdate.questionContent = newQuestion.questionContent;

        await this.save(questionToUpdate);

        return questionToUpdate;

    }
}