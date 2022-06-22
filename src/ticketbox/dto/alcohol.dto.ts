import {IsBoolean, IsInt, IsString } from "class-validator";

export class AlcoholDto {
    @IsString() 
    AlcoholName: string;

    @IsString() 
    category: string;

    @IsInt()
    AlcoholByVolume: number;

    @IsBoolean()
    sweet: boolean;

    @IsBoolean()
    bitter: boolean;

    @IsBoolean()
    refreshing: boolean;

    @IsBoolean()
    clean: boolean;

    @IsBoolean()
    fresh: boolean;

    @IsBoolean()
    sour: boolean;

    @IsString() 
    description: string;
}