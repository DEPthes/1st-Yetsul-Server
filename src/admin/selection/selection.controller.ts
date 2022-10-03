import { Controller, Get, Param } from '@nestjs/common';
import { SelectionService } from './selection.service';
import { Selection } from '../../Entity/box_office/selection.entity';


@Controller('selection')
export class SelectionController {
    constructor(private selectionService: SelectionService) { }


    // 전체 선택지 리스트 조회
    @Get()
    getSelectionList(): Promise<Selection[]> {
        return this.selectionService.getSelectionList();
    }
    
    // 선택지 조회
    @Get('/:id')
    getSelectionById(@Param('id') id: number): Promise<Selection> {
        return this.selectionService.getSelectionById(id);
    }
  }