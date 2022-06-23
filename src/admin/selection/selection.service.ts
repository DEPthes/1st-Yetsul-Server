import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectionDto } from './dto/selection.dto';
import { Selection } from './entities/selection.entity';
import { SelectionRepository } from './selection.repository';

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
  
      // 선택지 업로드
      async uploadSelection(selectionDto: SelectionDto): Promise<Selection> {
          return this.selectionRepository.uploadSelection(selectionDto);
      }
  
      // 선택지 조회
      async getSelectionById(id: number): Promise<Selection> {
          const found = await this.selectionRepository.findOne(id);
  
          if (!found) {
              throw new NotFoundException(`Cant't find question with id ${id}`);
          }
  
          return found;
      }
  
      // 선택지 수정
      async updateSelection(id: number, newSelection: SelectionDto): Promise<Selection> {
          return this.selectionRepository.updateSelection(id, newSelection);
      }
  
      // 선택지 삭제
      async deleteSelection(id: number): Promise<void> {
          const result = await this.selectionRepository.delete(id);
          console.log(result);
      }
  
  

}