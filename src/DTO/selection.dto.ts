import { ApiProperty } from "@nestjs/swagger";
import {IsString } from "class-validator";

export class SelectionDto {
    @ApiProperty({description: "선택지 내용"})
    @IsString() 
    selectionContent: string;
}