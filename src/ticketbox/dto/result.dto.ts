import {IsString } from "class-validator";
import { Question } from "src/admin/question/entities/question.entity";
import { Selection } from 'src/admin/selection/entities/selection.entity';

export class ResultDto {
    @IsString() 
    questionContent: Question;

    @IsString() 
    selectionContent: Selection[];
}