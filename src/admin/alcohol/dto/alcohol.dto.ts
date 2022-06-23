import {IsBoolean, IsInt, IsString } from "class-validator";

export class AlcoholDto {
    @IsString() 
    AlcoholName: string;

    @IsString() 
    Category: string;

    // 도수
    @IsInt()
    AlcoholByVolume: number;

    // 달달함
    @IsBoolean()
    sweet: boolean;

    // 씁슬함
    @IsBoolean()
    bitter: boolean;

    // 상큼함
    @IsBoolean()
    refreshing: boolean;

    // 깔끔함
    @IsBoolean()
    clean: boolean;

    // 청량함
    @IsBoolean()
    cool: boolean;

    // 새콤달콤
    @IsBoolean()
    sour: boolean;

    @IsString() 
    description: string;
}