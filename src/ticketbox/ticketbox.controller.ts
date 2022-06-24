import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { SelectionService } from 'src/admin/selection/selection.service';
import { TicketboxService } from './ticketbox.service';

@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService, private selectionService: SelectionService) { }

    // 답 1개와 그에 맞는 선택지들 가져오기
    @Get('/test/:uuid')
    @ApiOperation({ summary: '답과 선택지 조회 API', description: '답과 그에 대응하는 선택지 조회' })
    @ApiCreatedResponse({ description: '답과 그에 대응하는 선택지 조회'})

    getTest(@Param('uuid') uuid: string): Promise<any> {
        return this.ticketboxService.getTest(uuid);
    }
}
