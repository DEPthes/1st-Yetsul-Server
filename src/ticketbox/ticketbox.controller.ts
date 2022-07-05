import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Alcohol } from 'src/admin/alcohol/entities/alcohol.entity';
import { SelectionService } from 'src/admin/selection/selection.service';
import { TicketboxService } from './ticketbox.service';

@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService, private selectionService: SelectionService) { }

    // 답 1개와 그에 맞는 선택지들 가져오기
    @Get('/test/:uuid') // 문제의 uuid
    @ApiOperation({ summary: '답과 선택지 조회 API', description: '답과 그에 대응하는 선택지 조회. /ticketbox/test/6e43797d-363b-405e-95e5-deb454b66318' })
    @ApiCreatedResponse({ description: '답과 그에 대응하는 선택지 조회'})
    getTest(@Param('uuid') uuid: string): Promise<any> {
        return this.ticketboxService.getTest(uuid);
    }

    // 사용자의 선택지 param으로 받고 그에 해당하는 술 배열[2] 반환
    @Get('/result/alcohol/:id') // id: x1111111
    @ApiOperation({ summary: '매표소 결과 API (술)', description: '사용자의 선택지 param으로 받고 그에 해당하는 술 배열 반환. /ticketbox/result/alcohol/1111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 술 배열 반환'})
    getResultAlcohol(@Param('id') id: string): Promise<Alcohol[]> {
        return this.ticketboxService.getResultAlcohol(id);
    }


    @Get('/result/movie/:id') // 22221
    @ApiOperation({ summary: '매표소 결과 API (영화)', description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환. /ticketbox/result/movie/111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환'})
    getMovie(@Param('id') id: string): Promise<any> {
        return this.ticketboxService.getResultMovie(id);
    }

    @Get('/result/:id')
    @ApiOperation({ summary: '매표소 결과 API', description: '사용자의 선택지 param으로 받고 그에 해당하는 영화, 술 반환. /ticketbox/result/1111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 영화, 술 반환'})
    getResult(@Param('id') id: string): Promise<any> {
        return this.ticketboxService.getResult(id);
    }
}
