import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuestionAndSelectionDto } from '../../DTO/questionAndSelection.dto';
import { TicketboxService } from './ticketbox.service';

@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService) { }

    @Get('/test')
    getTest(@Body() questionAndSelectionDto: QuestionAndSelectionDto): Promise<any> {
        return this.ticketboxService.getTest(questionAndSelectionDto);
    }
    
    @Post('/result')
    getResult(@Body('resultCombination') resultCombination: string): Promise<any> {
        return this.ticketboxService.getResult(resultCombination);
    }

    // 하나만 나오는
    @Post('/result/alcoholone')
    async getResultAlcoholOne(@Body('id') id: string) {
        return await this.ticketboxService.getResultAlcohol(id);
    }

    @Post('/result/movie') // 22221(22)
    getMovie(@Body('id') id: string): Promise<any> {
        return this.ticketboxService.getResultMovie(id);
    }

    // 전체 id만 나오는 !!
    @Post('/result/alcoholall')
    async getResultAlcoholAll(@Body('id') id: string) {
        return [
            await this.ticketboxService.getResultAlcoholAll("1111x1"),
            await this.ticketboxService.getResultAlcoholAll("1112x1"),
            await this.ticketboxService.getResultAlcoholAll("1121x1"), // 여러
            await this.ticketboxService.getResultAlcoholAll("1122x1"),

            await this.ticketboxService.getResultAlcoholAll("1211x1"), // 1, 3
            await this.ticketboxService.getResultAlcoholAll("1212x1"),
            await this.ticketboxService.getResultAlcoholAll("1221x1"), // 1, 3
            await this.ticketboxService.getResultAlcoholAll("1222x1"),

            await this.ticketboxService.getResultAlcoholAll("2111x1"), // 1, 3
            await this.ticketboxService.getResultAlcoholAll("2112x1"),
            await this.ticketboxService.getResultAlcoholAll("2121x1"),
            await this.ticketboxService.getResultAlcoholAll("2122x1"),

            await this.ticketboxService.getResultAlcoholAll("2211x1"), // 0 
            await this.ticketboxService.getResultAlcoholAll("2212x1"),
            await this.ticketboxService.getResultAlcoholAll("2221x1"), // 0
            await this.ticketboxService.getResultAlcoholAll("2222x1"),

            await this.ticketboxService.getResultAlcoholAll("1111x2"),
            await this.ticketboxService.getResultAlcoholAll("1112x2"),
            await this.ticketboxService.getResultAlcoholAll("1121x2"),
            await this.ticketboxService.getResultAlcoholAll("1122x2"),

            await this.ticketboxService.getResultAlcoholAll("1211x2"),
            await this.ticketboxService.getResultAlcoholAll("1212x2"),
            await this.ticketboxService.getResultAlcoholAll("1221x2"),
            await this.ticketboxService.getResultAlcoholAll("1222x2"),

            await this.ticketboxService.getResultAlcoholAll("2111x2"),
            await this.ticketboxService.getResultAlcoholAll("2112x2"),
            await this.ticketboxService.getResultAlcoholAll("2121x2"),
            await this.ticketboxService.getResultAlcoholAll("2122x2"),

            await this.ticketboxService.getResultAlcoholAll("2211x2"), // 0
            await this.ticketboxService.getResultAlcoholAll("2212x2"), // 여러 
            await this.ticketboxService.getResultAlcoholAll("2221x2"), // 0
            await this.ticketboxService.getResultAlcoholAll("2222x2"),

            await this.ticketboxService.getResultAlcoholAll("1111x3"),
            await this.ticketboxService.getResultAlcoholAll("1112x3"),
            await this.ticketboxService.getResultAlcoholAll("1121x3"),
            await this.ticketboxService.getResultAlcoholAll("1122x3"),

            await this.ticketboxService.getResultAlcoholAll("1211x3"),
            await this.ticketboxService.getResultAlcoholAll("1212x3"),
            await this.ticketboxService.getResultAlcoholAll("1221x3"),
            await this.ticketboxService.getResultAlcoholAll("1222x3"),

            await this.ticketboxService.getResultAlcoholAll("2111x3"),
            await this.ticketboxService.getResultAlcoholAll("2112x3"),
            await this.ticketboxService.getResultAlcoholAll("2121x3"),
            await this.ticketboxService.getResultAlcoholAll("2122x3"),

            await this.ticketboxService.getResultAlcoholAll("2211x3"), // 여러
            await this.ticketboxService.getResultAlcoholAll("2212x3"), // 2
            await this.ticketboxService.getResultAlcoholAll("2221x3"),
            await this.ticketboxService.getResultAlcoholAll("2222x3"), // 2
        ];
    }
}