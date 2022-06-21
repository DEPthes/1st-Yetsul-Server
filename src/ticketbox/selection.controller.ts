import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SelectionService } from './selection.service';
import { CreateSelectionDto } from './dto/selection/create-selection.dto';
import { UpdateSelectionDto } from './dto/selection/update-selection.dto';

@Controller('selection')
export class SelectionController {
  constructor(private readonly selectionService: SelectionService) {}

  @Post()
  create(@Body() createSelectionDto: CreateSelectionDto) {
    return this.selectionService.create(createSelectionDto);
  }

  @Get()
  findAll() {
    return this.selectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.selectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSelectionDto: UpdateSelectionDto) {
    return this.selectionService.update(+id, updateSelectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.selectionService.remove(+id);
  }
}
