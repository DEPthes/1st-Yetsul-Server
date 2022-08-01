import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionDto } from '../../DTO/question.dto';
import { Question } from '../../Entity/question.entity';
import { QuestionService } from './question.service';

@ApiExcludeController()
@ApiTags("question")
@Controller("question")
export class QuestionController {
    constructor(private questionService: QuestionService) { }


    // 전체 질문 리스트 조회
    @Get()
    // @ApiOperation({ summary: '전체 질문 리스트 조회 API', description: '전체 질문 리스트 조회' }) // 요청 URL 에 매핑된 API 에 대한 설명
    // @ApiCreatedResponse({ description: '전체 질문 리스트 조회', type: Question }) // API 응답에 대한 정의
    getQuestionList(): Promise<Question[]> {
        return this.questionService.getQuestionList();
    }
  }