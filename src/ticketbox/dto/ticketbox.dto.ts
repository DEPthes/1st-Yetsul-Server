import {IsString } from "class-validator";

export class ticketboxDto {
    @IsString() 
    readonly questionContent: string;
    @IsString() 
    readonly selectionContent: string;
}
