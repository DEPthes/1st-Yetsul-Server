import { IsString } from "class-validator";

export class CreateReviewDto {
    
    @IsString()
    title: string;
    
    @IsString()
    content: string;
    
    star: number;

    @IsString()
    saveFlag: string; // 이거 enum으로 수정해야 함.
    // 엔티티도 수정해야 함. 우선 하고 enum으론 나중에 바꾸기
    
    @IsString()
    reviewImgUrl: string;
}
