import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { IntroductionAlcoholService } from './introductionAlcohol.service';

@ApiTags("술 소개 페이지")
@Controller('alcohol')
export class IntroductionAlcoholController {
  constructor(private readonly alcoholService: IntroductionAlcoholService) {}
 
    // 술 리스트 조회
    @Get()
    @ApiOperation({ summary: '술 리스트 조회 API', description: '술 리스트 조회' })
    @ApiCreatedResponse({ description: '술 리스트 조회', type: Alcohol })
    getAlcoholList(@Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholList(filter);
    }

    // 술 카테고리 별 리스트 조회
    @Get('/:category')
    @ApiOperation({ summary: '술 리스트 조회 API', description: '술 리스트 조회' })
    @ApiCreatedResponse({ description: '술 리스트 조회', type: Alcohol })
    getAlcoholListByCategory(@Param('category') category: number, @Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholListByCategory(category, filter);
    }

    // 개별 술 조회
    @Get('/:id')
    @ApiOperation({ summary: 'id로 술 조회 API', description: 'id로 술 조회. /alcohol/1' })
    @ApiCreatedResponse({ description: 'id로 술 조회', type: Alcohol })
    getAlcoholById(@Param('id') id: number): Promise<Alcohol> {
        return this.alcoholService.getAlcoholById(id);
    }
}