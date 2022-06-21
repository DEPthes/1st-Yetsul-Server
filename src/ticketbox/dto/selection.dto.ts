import {IsString } from "class-validator";

export class SelectionDto {
    @IsString() 
    selectionContent: string;
}