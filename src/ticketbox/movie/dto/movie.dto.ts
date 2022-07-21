import { ApiProperty } from "@nestjs/swagger";
import {IsInt, IsString } from "class-validator";

export class MovieDto {
    @ApiProperty({ description: "영화 제목"})
    @IsString() 
    title: string;
    
    @ApiProperty({ description: "영화 내용"})
    @IsString() 
    description: string;
    
    @ApiProperty({ description: "영화 이미지 url"})
    @IsString() 
    image: string;
    
    @ApiProperty({ description: "영화에 한 개에 매칭되는 술 아이디"})
    @IsInt()
    alcohol: number;
}