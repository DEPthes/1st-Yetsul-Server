import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LikeDto {
    
    @ApiProperty({description: "유저 아이디"})
    @IsString()
    userId: string;
    
    @ApiProperty({description: "술 아이디"})
    alcoholId: number;
}
