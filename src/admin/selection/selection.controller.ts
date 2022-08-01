import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SelectionService } from './selection.service';
import { ApiCreatedResponse, ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Selection } from '../../Entity/selection.entity';


@ApiExcludeController()
@ApiTags("selection")
@Controller('selection')
export class SelectionController {
    constructor(private selectionService: SelectionService) { }


    // 전체 선택지 리스트 조회
    @Get()
    @ApiOperation({ summary: '전체 선택지 리스트 조회 API', description: '전체 선택지 리스트 조회.' }) 
    @ApiCreatedResponse({ description: '전체 선택지 리스트 조회', type: Selection }) 
    getSelectionList(): Promise<Selection[]> {
        return this.selectionService.getSelectionList();
    }
    
    // 선택지 조회
    @Get('/:id')
    // @ApiOperation({ summary: 'id로 선택지 조회 API', description: 'id로 선택지 작품 조회. /selection/1' })
    // @ApiCreatedResponse({ description: 'id로 선택지 작품 조회', type: Selection })
    getSelectionById(@Param('id') id: number): Promise<Selection> {
        return this.selectionService.getSelectionById(id);
    }
  }