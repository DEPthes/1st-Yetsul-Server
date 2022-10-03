import {IsString } from "class-validator";

export class QuestionAndSelectionDto {
    
    @IsString() 
    readonly question: string;

    @IsString() 
    readonly selection1: string;
    
    @IsString() 
    readonly selection2: string;
    
    @IsString() 
    readonly selection3: string;
}