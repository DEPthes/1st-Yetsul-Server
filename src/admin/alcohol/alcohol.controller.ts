import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AlcoholService } from './alcohol.service';
import { AlcoholDto } from './dto/alcohol.dto';
import { Alcohol } from './entities/alcohol.entity';

@Controller('alcohol')
export class AlcoholController {
  constructor(private readonly alcoholService: AlcoholService) {}
 
    // 술 리스트 조회
    @Get('/alcohols')
    getAlcoholList(): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholList();
    }

    // 개별 술 조회
    @Get('/alcohol/:id')
    @ApiOperation({ summary: 'id로 술 조회 API', description: 'id로 술 조회' })
    @ApiCreatedResponse({ description: 'id로 술 조회', type: Alcohol })
    getAlcoholById(@Param('id') id: number): Promise<Alcohol> {
        return this.alcoholService.getAlcoholById(id);
    }
}
