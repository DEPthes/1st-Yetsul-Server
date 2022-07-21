import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateReviewDto {
    
    @ApiProperty({description: "리뷰 제목"})
    @IsString()
    title: string;
    
    @ApiProperty({description: "리뷰 내용"})
    @IsString()
    content: string;
    
    @ApiProperty({description: "리뷰 별점"})
    star;
    
    @ApiProperty({description: "리뷰 이미지 url"})
    @IsString()
    reviewImgUrl: string;
}
