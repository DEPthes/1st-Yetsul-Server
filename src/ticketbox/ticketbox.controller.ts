import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { QuestionDto } from './dto/question.dto';
import { ResultDto } from './dto/result.dto';
import { SelectionDto } from './dto/selection.dto';
import { Alcohol } from './entities/alcohol.entity';
import { Question } from './entities/question.entity';
import { Selection } from './entities/selection.entity';
import { TicketboxService } from './ticketbox.service';

@Controller('ticketbox')
export class QuestionController {
    constructor(private ticketboxService: TicketboxService) { }


    // 전체 질문 리스트 조회
    @Get('/questions')
    @ApiOperation({ summary: '전체 질문 리스트 조회 API', description: '전체 질문 리스트 조회' }) // 요청 URL 에 매핑된 API 에 대한 설명
    @ApiCreatedResponse({ description: '전체 질문 리스트 조회', type: Question }) // API 응답에 대한 정의

    getQuestionList(): Promise<Question[]> {
        return this.ticketboxService.getQuestionList();
    }

    // 질문 업로드
    @Post('/questions/upload')
    @ApiOperation({ summary: '질문 업로드 API', description: '질문 업로드' })
    @ApiCreatedResponse({ description: '질문 업로드', type: Question })

    uploadQuestion(@Body() questionDto: QuestionDto): Promise<Question> {
        return this.ticketboxService.uploadQuestion(questionDto);
    }

    // 질문 조회
    @Get('/question/:id')
    @ApiOperation({ summary: 'id로 질문 조회 API', description: 'id로 질문 조회' })
    @ApiCreatedResponse({ description: 'id로 질문 조회', type: Question })

    getQuestionById(@Param('id') id: number): Promise<Question> {
        return this.ticketboxService.getQuestionById(id);
    }

    // 질문 수정
    @Patch('/question/:id')
    @ApiOperation({ summary: 'id로 질문 수정 API', description: 'id로 질문 수정' })
    @ApiCreatedResponse({ description: 'id로 질문 수정', type: Question })

    updateQuestion(@Param('id') id: number, @Body() questionDto: QuestionDto): Promise<Question> {
        return this.ticketboxService.updateQuestion(id, questionDto);
    }

    // 질문 삭제
    @Delete('/question/:id')
    @ApiOperation({ summary: 'id로 질문 삭제 API', description: 'id로 질문 삭제' })
    @ApiCreatedResponse({ description: 'id로 질문 삭제', type: Question })

    deleteQuestion(@Param('id') id: number): Promise<void> {
        return this.ticketboxService.deleteQuestion(id);
    }


    // 전체 선택지 리스트 조회
    @Get('selections')
    @ApiOperation({ summary: '전체 선택지 리스트 조회 API', description: '전체 선택지 리스트 조회' }) 
    @ApiCreatedResponse({ description: '전체 선택지 리스트 조회', type: Selection }) 
    getSelectionList(): Promise<Selection[]> {
        return this.ticketboxService.getSelectionList();
    }

    // 선택지 업로드
    @Post('/selections/upload')
    @ApiOperation({ summary: '선택지 업로드 API', description: '선택지 업로드' })
    @ApiCreatedResponse({ description: '선택지 업로드', type: Selection })
    uploadSelection(@Body() selectionDto: SelectionDto): Promise<Selection> {
        return this.ticketboxService.uploadSelection(selectionDto);
    }

    // 선택지 조회
    @Get('/selection/:id')
    @ApiOperation({ summary: 'id로 선택지 조회 API', description: 'id로 선택지 작품 조회' })
    @ApiCreatedResponse({ description: 'id로 선택지 작품 조회', type: Selection })
    getSelectionById(@Param('id') id: number): Promise<Selection> {
        return this.ticketboxService.getSelectionById(id);
    }

    // 선택지 수정
    @Patch('/selection/:id')
    @ApiOperation({ summary: 'id로 선택지 수정 API', description: 'id로 선택지 수정' })
    @ApiCreatedResponse({ description: 'id로 선택지 수정', type: Selection })
    updateSelection(@Param('id') id: number, @Body() selectionDto: SelectionDto): Promise<Selection> {
        return this.ticketboxService.updateSelection(id, selectionDto);
    }

    // 선택지 삭제
    @Delete('/selection/:id')
    @ApiOperation({ summary: 'id로 선택지 삭제 API', description: 'id로 선택지 삭제' })
    @ApiCreatedResponse({ description: 'id로 선택지 삭제', type: Selection })
    deleteArt(@Param('id') id: number): Promise<void> {
        return this.ticketboxService.deleteSelection(id);
    }

    ///////// 술

    // 술 리스트 조회
    @Get('/alcohols')
    getAlcoholList(): Promise<Alcohol[]> {
        return this.ticketboxService.getAlcoholList();
    }

    // 개별 술 조회
    @Get('/alcohol/:id')
    @ApiOperation({ summary: 'id로 술 조회 API', description: 'id로 술 조회' })
    @ApiCreatedResponse({ description: 'id로 술 조회', type: Alcohol })
    getAlcoholById(@Param('id') id: number): Promise<Alcohol> {
        return this.ticketboxService.getAlcoholById(id);
    }
}
