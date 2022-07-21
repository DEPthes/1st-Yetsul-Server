import { ApiProperty } from "@nestjs/swagger";
import {IsString } from "class-validator";

export class QuestionDto {
    @ApiProperty({description: "질문 내용"})
    @IsString() 
    readonly questionContent: string;
}