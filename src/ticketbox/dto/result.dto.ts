import {IsString } from "class-validator";

export class ResultDto {
    @IsString() 
    questionContent: string;
}