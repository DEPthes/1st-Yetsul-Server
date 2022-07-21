import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Alcohol } from 'src/admin/alcohol/entities/alcohol.entity';
import { SelectionService } from 'src/admin/selection/selection.service';
import { QuestionAndSelectionDto } from './dto/questionAndSelection.dto';
import { TicketboxService } from './ticketbox.service';

@ApiTags("매표소")
@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService, private selectionService: SelectionService) { }

    @Post('/test')
    @ApiBody({ type: QuestionAndSelectionDto})
    @ApiOperation({ summary: '답과 선택지 조회 API', description: '답과 그에 대응하는 선택지 조회. /ticketbox/test/question' })
    getTest(@Body() questionAndSelectionDto: QuestionAndSelectionDto ): Promise<any> {
        return this.ticketboxService.getTest(questionAndSelectionDto);
    }
    @Post('/result')
    @ApiOperation({ summary: '매표소 결과 API', description: 'requestBody: {"resultCombination": "string:"} - 사용자의 선택지 param으로 받고 그에 해당하는 영화, 술 반환. /ticketbox/result/1111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 영화, 술 반환'})
    getResult(@Body() resultCombination: string): Promise<any> {
        return this.ticketboxService.getResult(resultCombination);
    }

    // 사용자의 선택지 param으로 받고 그에 해당하는 술 배열[2] 반환
    // @ApiExcludeEndpoint()
    // @Get('/result/alcohol') // id: (1)111111
    // @ApiOperation({ summary: '매표소 결과 API (술)', description: '사용자의 선택지 param으로 받고 그에 해당하는 술 배열 반환. /ticketbox/result/alcohol/1111111' })
    // @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 술 배열 반환'})
    // getResultAlcohol(@Body() resultDto: ResultDto): Promise<Alcohol[]> {
    //     return this.ticketboxService.getResultAlcohol(resultDto);
    // }
    
    
    // @ApiExcludeEndpoint()
    // @Post('/result/movie') // 22221(22)
    // @ApiOperation({ summary: '매표소 결과 API (영화)', description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환. /ticketbox/result/movie/111111' })
    // @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환'})
    // getMovie(@Body('id') id: string): Promise<any> {
    //     return this.ticketboxService.getResultMovie(id);
    // }

   
}
