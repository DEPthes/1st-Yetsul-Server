import { ApiProperty } from "@nestjs/swagger";
import {IsBoolean, IsInt, IsString } from "class-validator";

export class AlcoholDto {
    @ApiProperty({description: "술 이름"})
    @IsString() 
    AlcoholName: string;
    
    @ApiProperty({description: "카테고리 아이디"})
    @IsInt() 
    Category: number;
    
    // 양조장
    @ApiProperty({description: "해당 술을 제조한 양조장 이름"})
    @IsString() 
    brewery: string;
    
    @ApiProperty({description: "해당 술의 가격"})
    @IsInt() 
    price: number;
    
    @ApiProperty({description: "해당 술의 도수"})
    AlcoholByVolume;
    
    @ApiProperty({description: "해당 술의 달달함 여부"})
    @IsBoolean()
    sweet: boolean;
    
    @ApiProperty({description: "해당 술의 씁쓸함 여부"})
    @IsBoolean()
    bitter: boolean;
    
    @ApiProperty({description: "해당 술의 상큼함 여부"})
    @IsBoolean()
    refreshing: boolean;
    
    @ApiProperty({description: "해당 술의 깔끔함 여부"})
    @IsBoolean()
    clean: boolean;
    
    @ApiProperty({description: "해당 술의 청량함 여부"})
    @IsBoolean()
    cool: boolean;

    @ApiProperty({description: "해당 술의 새콤달콤함 여부"})
    @IsBoolean()
    sour: boolean;

    @IsString() 
    @ApiProperty({description: "해당 술에 대한 설명"})
    description: string;

    // 별점
    @ApiProperty({description: "해당 술에 대한 별점 정도"})
    star;

    @IsString()
    @ApiProperty({description: "해당 술에 대한 이미지 url"})
    alcoholImage: string;
}