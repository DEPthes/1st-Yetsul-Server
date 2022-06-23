import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Question } from 'src/admin/question/entities/question.entity';
import { Selection } from 'src/admin/selection/entities/selection.entity';
import { ResultDto } from './dto/result.dto';
import { TicketboxService } from './ticketbox.service';

@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService) { }

    @Get('/test/:id')
    getTestPage(@Param('id') id: number): Promise<Selection> {
        return this.ticketboxService.getTestByQuestionId(id);
    }


    // 질문 조회
    @Get('/:id')
    @ApiOperation({ summary: 'id로 질문 조회 API', description: 'id로 질문 조회' })
    @ApiCreatedResponse({ description: 'id로 질문 조회', type: Question })

    getQuestionById(@Param('id') id: number): Promise<Question> {
        return this.ticketboxService.getQuestionById(id);
    }


    // // 선택지 조회
    // @Get('/:id')
    // @ApiOperation({ summary: 'id로 선택지 조회 API', description: 'id로 선택지 작품 조회' })
    // @ApiCreatedResponse({ description: 'id로 선택지 작품 조회', type: Selection })
    // getSelectionById(@Param('id') id: number): Promise<Selection> {
    //     return this.ticketboxService.getSelectionById(id);
    // }

}
