import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SelectionService } from './selection.service';
import { SelectionDto } from './dto/selection.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Selection } from './entities/selection.entity';


@Controller('selection')
export class SelectionController {
    constructor(private selectionService: SelectionService) { }


    // 전체 선택지 리스트 조회
    @Get()
    @ApiOperation({ summary: '전체 선택지 리스트 조회 API', description: '전체 선택지 리스트 조회' }) 
    @ApiCreatedResponse({ description: '전체 선택지 리스트 조회', type: Selection }) 
    getSelectionList(): Promise<Selection[]> {
        return this.selectionService.getSelectionList();
    }

    // 선택지 업로드
    @Post('/upload')
    @ApiOperation({ summary: '선택지 업로드 API', description: '선택지 업로드' })
    @ApiCreatedResponse({ description: '선택지 업로드', type: Selection })
    uploadSelection(@Body() selectionDto: SelectionDto): Promise<Selection> {
        return this.selectionService.uploadSelection(selectionDto);
    }

    // 선택지 조회
    @Get('/:id')
    @ApiOperation({ summary: 'id로 선택지 조회 API', description: 'id로 선택지 작품 조회. /selection/1' })
    @ApiCreatedResponse({ description: 'id로 선택지 작품 조회', type: Selection })
    getSelectionById(@Param('id') id: number): Promise<Selection> {
        return this.selectionService.getSelectionById(id);
    }

    // 선택지 수정
    @Patch('/:id')
    @ApiOperation({ summary: 'id로 선택지 수정 API', description: 'id로 선택지 수정' })
    @ApiCreatedResponse({ description: 'id로 선택지 수정', type: Selection })
    updateSelection(@Param('id') id: number, @Body() selectionDto: SelectionDto): Promise<Selection> {
        return this.selectionService.updateSelection(id, selectionDto);
    }

    // 선택지 삭제
    @Delete('/:id')
    @ApiOperation({ summary: 'id로 선택지 삭제 API', description: 'id로 선택지 삭제' })
    @ApiCreatedResponse({ description: 'id로 선택지 삭제', type: Selection })
    deleteArt(@Param('id') id: number): Promise<void> {
        return this.selectionService.deleteSelection(id);
    }
  }