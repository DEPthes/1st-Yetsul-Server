import {IsBoolean, IsInt, IsString } from "class-validator";

export class AlcoholDto {
    AlcoholName: string;
    
    @IsInt() 
    Category: number;
    
    // 양조장
    @IsString() 
    brewery: string;
    
    @IsInt() 
    price: number;
    
    AlcoholByVolume;
    
    @IsBoolean()
    sweet: boolean;
    
    @IsBoolean()
    bitter: boolean;
    
    @IsBoolean()
    refreshing: boolean;
    
    @IsBoolean()
    clean: boolean;
    
    @IsBoolean()
    cool: boolean;

    @IsBoolean()
    sour: boolean;

    @IsString() 
    description: string;

    // 별점
    star;

    @IsString()
    alcoholImage: string;
}