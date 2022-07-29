import { Controller, Get, Post, Body } from '@nestjs/common';
import {ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionAndSelectionDto } from './dto/questionAndSelection.dto';
import { TicketboxService } from './ticketbox.service';

@ApiTags("매표소")
@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService) { }

    @Post('/test')
    @ApiBody({ type: QuestionAndSelectionDto })
    @ApiOperation({ summary: '답과 선택지 조회 API', description: '답과 그에 대응하는 선택지 조회.' })
    getTest(@Body() questionAndSelectionDto: QuestionAndSelectionDto): Promise<any> {
        return this.ticketboxService.getTest(questionAndSelectionDto);
    }
    @Post('/result')
    @ApiBody({
        schema: {
          properties: {
            resultCombination: { type: "string" }
          }
        }
      })
    @ApiOperation({ summary: '매표소 결과 API', description: '사용자의 선택지(1212121)에 해당하는 영화, 술 반환' })
    @ApiCreatedResponse({ description: '사용자의 선택지(1212121)에 해당하는 영화, 술 반환' })
    getResult(@Body('resultCombination') resultCombination: string): Promise<any> {
        return this.ticketboxService.getResult(resultCombination);
    }

    // 전체 id만 나오는 !!
    @ApiExcludeEndpoint()
    @Post('/result/alcoholall')
    @ApiOperation({ summary: '매표소 결과 API (술)', description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개) /ticketbox/result/alcohol/1111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개)' })
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

    // 하나만 나오는
    @ApiExcludeEndpoint()
    @Post('/result/alcoholone')
    @ApiOperation({ summary: '매표소 결과 API (술)', description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개) /ticketbox/result/alcohol/1111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개)' })
    async getResultAlcoholOne(@Body('id') id: string) {
        return await this.ticketboxService.getResultAlcohol(id);
    }

    @ApiExcludeEndpoint()
    @Post('/result/movie') // 22221(22)
    @ApiOperation({ summary: '매표소 결과 API (영화)', description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환. /ticketbox/result/movie/111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환' })
    getMovie(@Body('id') id: string): Promise<any> {
        return this.ticketboxService.getResultMovie(id);
    }
}
