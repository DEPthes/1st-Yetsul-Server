import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MainService } from './main.service';
import { CreateMainDto } from './dto/create-main.dto';
import { UpdateMainDto } from './dto/update-main.dto';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Post()
  create(@Body() createMainDto: CreateMainDto) {
    return this.mainService.create(createMainDto);
  }

  @Get()
  findAll() {
    return this.mainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mainService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMainDto: UpdateMainDto) {
    return this.mainService.update(+id, updateMainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mainService.remove(+id);
  }
}
