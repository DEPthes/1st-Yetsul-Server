import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Question } from 'src/admin/question/entities/question.entity';
import { Selection } from 'src/admin/selection/entities/selection.entity';
import { SelectionService } from 'src/admin/selection/selection.service';
import { ResultDto } from './dto/result.dto';
import { TicketboxService } from './ticketbox.service';

@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService, private selectionService: SelectionService) { }

    // 답 1개, 선택지 2개 가져오기 (id, id+1)
    @Get('/test/:id')
    getTest(@Param('id') id: string): Promise<any> {
        return this.ticketboxService.getTest(id);
    }

    // 답 1개, 선택지 2개 가져오기 (id, id+1) => uuid
    @Get('/test/:uuid')
    getTest2(@Body('id') id: string): Promise<any> {
        return this.ticketboxService.getTest(id);
    }
}
