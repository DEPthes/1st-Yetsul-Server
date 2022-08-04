import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AlcoholService } from './alcohol.service';
import { Alcohol } from '../../Entity/Alcohol/alcohol.entity';

@Controller('admin')
export class AlcoholController {

    constructor(private readonly alcoholService: AlcoholService) { }

    // 개별 술 조회
    @Get('/alcohol/:id')
    @ApiOperation({ summary: 'id로 술 조회 API', description: 'id로 술 조회. /alcohol/1' })
    @ApiCreatedResponse({ description: 'id로 술 조회', type: Alcohol })
    getAlcoholById(@Param('id') id: number): Promise<Alcohol> {
        return this.alcoholService.getAlcoholById(id);
    }

    // 술 카테고리 별 리스트 조회
    @Post('/list/:category')
    @ApiOperation({ summary: '술 카테고리 별 리스트 조회 API', description: '술 카테고리 별 리스트 조회' })
    @ApiCreatedResponse({ description: '술 카테고리 별 리스트 조회', type: Alcohol })
    getAlcoholListByCategory(@Param('category') category: number, @Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholListByCategory(category, filter);
    }

    // 술 리스트 조회
    @Post('/list')
    @ApiOperation({ summary: '술 리스트 조회 API', description: '술 리스트 조회' })
    @ApiCreatedResponse({ description: '술 리스트 조회', type: Alcohol })
    getAlcoholList(@Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholList(filter);
    }
}