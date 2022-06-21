import { Injectable } from '@nestjs/common';
import { CreateSelectionDto } from './dto/selection/create-selection.dto';
import { UpdateSelectionDto } from './dto/selection/update-selection.dto';

@Injectable()
export class SelectionService {
  create(createSelectionDto: CreateSelectionDto) {
    return 'This action adds a new selection';
  }

  findAll() {
    return `This action returns all selection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} selection`;
  }

  update(id: number, updateSelectionDto: UpdateSelectionDto) {
    return `This action updates a #${id} selection`;
  }

  remove(id: number) {
    return `This action removes a #${id} selection`;
  }
}
