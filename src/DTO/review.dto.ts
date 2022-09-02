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
    star: number;

    // 리뷰 저장 상태값 플래그
    // dto에는 안넣어도 되나?
    @ApiProperty({description: "리뷰 저장 상태값 플래그"})
    @IsString()
    saveFlag: string; // 이거 enum으로 수정해야 함.
    // 엔티티도 수정해야 함. 우선 하고 enum으론 나중에 바꾸기
    
    @ApiProperty({description: "리뷰 이미지 url"})
    @IsString()
    reviewImgUrl: string;
}
