import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { QuestionDto } from './dto/question.dto';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
@Controller("question")
export class QuestionController {
    constructor(private questionService: QuestionService) { }


    // 전체 질문 리스트 조회
    @Get()
    @ApiOperation({ summary: '전체 질문 리스트 조회 API', description: '전체 질문 리스트 조회' }) // 요청 URL 에 매핑된 API 에 대한 설명
    @ApiCreatedResponse({ description: '전체 질문 리스트 조회', type: Question }) // API 응답에 대한 정의

    getQuestionList(): Promise<Question[]> {
        return this.questionService.getQuestionList();
    }

    // 질문 업로드
    @Post('/upload')
    @ApiOperation({ summary: '질문 업로드 API', description: '질문 업로드' })
    @ApiCreatedResponse({ description: '질문 업로드', type: Question })

    createQuestion(@Body() questionDto: QuestionDto): Promise<Question> {
        return this.questionService.createQuestion(questionDto);
    }

    // 질문 조회
    @Get('/:id')
    @ApiOperation({ summary: 'id로 질문 조회 API', description: 'id로 질문 조회' })
    @ApiCreatedResponse({ description: 'id로 질문 조회', type: Question })

    getQuestionById(@Param('id') id: number): Promise<Question> {
        return this.questionService.getQuestionById(id);
    }

    // 질문 수정
    @Patch('/:id')
    @ApiOperation({ summary: 'id로 질문 수정 API', description: 'id로 질문 수정' })
    @ApiCreatedResponse({ description: 'id로 질문 수정', type: Question })

    updateQuestion(@Param('id') id: number, @Body() questionDto: QuestionDto): Promise<Question> {
        return this.questionService.updateQuestion(id, questionDto);
    }

    // 질문 삭제
    @Delete('/:id')
    @ApiOperation({ summary: 'id로 질문 삭제 API', description: 'id로 질문 삭제' })
    @ApiCreatedResponse({ description: 'id로 질문 삭제', type: Question })

    deleteQuestion(@Param('id') id: number): Promise<void> {
        return this.questionService.deleteQuestion(id);
    }
  }