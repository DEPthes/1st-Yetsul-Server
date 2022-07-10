import { IsString } from "class-validator";

export class CreateReviewDto {
    @IsString()
    title: string;

    @IsString()
    content: string;
}
