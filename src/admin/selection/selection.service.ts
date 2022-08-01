import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectionRepository } from 'src/Repository/selection.repository';
import { Selection } from '../../Entity/selection.entity';

@Injectable()
export class SelectionService {
    constructor(
        @InjectRepository(SelectionRepository)
        private selectionRepository: SelectionRepository,
    ){}

        // 선택지 리스트 조회
        async getSelectionList(): Promise <Selection[]> {
          return await this.selectionRepository.find();
      }
  
     
      // 선택지 조회
      async getSelectionById(id: number): Promise<Selection> {
          const found = await this.selectionRepository.findOne(id);
  
          if (!found) {
              throw new NotFoundException(`Cant't find question with id ${id}`);
          }
  
          return found;
      }
  
}