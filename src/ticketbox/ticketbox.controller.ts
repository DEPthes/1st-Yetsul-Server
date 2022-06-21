import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { SelectionDto } from './dto/selection.dto';
import { Question } from './entities/question.entity';
import { Selection } from './entities/selection.entity';
import { QuestionService } from './ticketbox.service';

@Controller('ticketbox')
export class QuestionController {
    constructor(private questionService: QuestionService) { }

    // 전체 질문 리스트 조회
    @Get('/questions')
    //@ApiOperation({ summary: '전체 작품 리스트 조회 API', description: '전체 작품 리스트 조회' }) // 요청 URL 에 매핑된 API 에 대한 설명
    //@ApiCreatedResponse({ description: '전체 작품 리스트 조회', type: Art }) // API 응답에 대한 정의
    getQuestionList(): Promise<Question[]> {
        return this.questionService.getQuestionList();
    }

    // 질문 업로드
    @Post('/questions/upload')
    // @ApiOperation({ summary: '작품 업로드 API', description: '작품 업로드' })
    // @ApiCreatedResponse({ description: '작품 업로드', type: Art })
    uploadQuestion(@Body() questionDto: QuestionDto): Promise<Question> {
        return this.questionService.uploadQuestion(questionDto);
    }

    // 질문 조회
    @Get('/question/:id')
    // @ApiOperation({ summary: '개별 작품 조회 API', description: '개별 작품 조회' })
    // @ApiCreatedResponse({ description: '개별 작품 조회', type: Art })
    getQuestionById(@Param('id') id: number): Promise<Question> {
        return this.questionService.getQuestionById(id);
    }

    // 질문 수정
    @Patch('/question/:id')
    // @ApiOperation({ summary: '개별 작품 수정 API', description: '개별 작품 수정' })
    // @ApiCreatedResponse({ description: '개별 작품 수정', type: Art })
    updateQuestion(@Param('id') id: number, @Body() questionDto: QuestionDto): Promise<Question> {
        return this.questionService.updateQuestion(id, questionDto);
    }

    // 질문 삭제
    @Delete('/question/:id')
    // @ApiOperation({ summary: '개별 작품 삭제 API', description: '개별 작품 삭제' })
    // @ApiCreatedResponse({ description: '개별 작품 삭제', type: Art })
    deleteQuestion(@Param('id') id: number): Promise<void> {
        return this.questionService.deleteQuestion(id);
    }

    /////////////////// 선택지

    // 전체 답안 리스트 조회
    @Get('selections')
    //@ApiOperation({ summary: '전체 작품 리스트 조회 API', description: '전체 작품 리스트 조회' }) // 요청 URL 에 매핑된 API 에 대한 설명
    //@ApiCreatedResponse({ description: '전체 작품 리스트 조회', type: Art }) // API 응답에 대한 정의
    getSelectionList(): Promise<Selection[]> {
        return this.questionService.getSelectionList();
    }

    // 답안 업로드
    @Post('/selections/upload')
    // @ApiOperation({ summary: '작품 업로드 API', description: '작품 업로드' })
    // @ApiCreatedResponse({ description: '작품 업로드', type: Art })
    uploadSelection(@Body() selectionDto: SelectionDto): Promise<Selection> {
        return this.questionService.uploadSelection(selectionDto);
    }

    // 답안 조회
    @Get('/selection/:id')
    // @ApiOperation({ summary: '개별 작품 조회 API', description: '개별 작품 조회' })
    // @ApiCreatedResponse({ description: '개별 작품 조회', type: Art })
    getSelectionById(@Param('id') id: number): Promise<Selection> {
        return this.questionService.getSelectionById(id);
    }

    // 답안 수정
    @Patch('/selection/:id')
    // @ApiOperation({ summary: '개별 작품 수정 API', description: '개별 작품 수정' })
    // @ApiCreatedResponse({ description: '개별 작품 수정', type: Art })
    updateSelection(@Param('id') id: number, @Body() selectionDto: SelectionDto): Promise<Selection> {
        return this.questionService.updateSelection(id, selectionDto);
    }

    // 답안 삭제
    @Delete('/selection/:id')
    // @ApiOperation({ summary: '개별 작품 삭제 API', description: '개별 작품 삭제' })
    // @ApiCreatedResponse({ description: '개별 작품 삭제', type: Art })
    deleteArt(@Param('id') id: number): Promise<void> {
        return this.questionService.deleteSelection(id);
    }
    
}
