import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthDto {
    @ApiProperty({description: "이메일"})
    @IsString()
    email: string;
    
    @ApiProperty({description: "프로필 이미지 url"})
    @IsString()
    profileImg: string;
}
