import {IsString } from "class-validator";

export class MovieDto {
    @IsString() 
    title: string;

    @IsString() 
    description: string;

    @IsString() 
    image: string;
}