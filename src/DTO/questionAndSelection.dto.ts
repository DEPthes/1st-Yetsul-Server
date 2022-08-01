import { ApiProperty } from "@nestjs/swagger";
import {IsString } from "class-validator";

export class QuestionAndSelectionDto {
    
    @ApiProperty({description: "질문에 대한 내용"})
    @IsString() 
    readonly question: string;

    @ApiProperty({description: "1번째 선택지에 대한 내용"})
    @IsString() 
    readonly selection1: string;
    
    @ApiProperty({description: "2번째 선택지에 대한 내용"})
    @IsString() 
    readonly selection2: string;
    
    @ApiProperty({description: "3번째 선택지에 대한 내용"})
    @IsString() 
    readonly selection3: string;
}