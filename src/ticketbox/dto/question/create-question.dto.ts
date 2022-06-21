import {IsString } from "class-validator";



export class CreateQuestionDto {
    @IsString() 
    description: string;

}

