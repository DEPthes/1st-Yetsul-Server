import {IsString } from "class-validator";

export class QuestionDto {
    @IsString() 
    readonly questionContent: string;
}