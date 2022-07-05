import { Injectable } from '@nestjs/common';
import { CreateMainDto } from './dto/create-main.dto';
import { UpdateMainDto } from './dto/update-main.dto';

@Injectable()
export class MainService {
  create(createMainDto: CreateMainDto) {
    return 'This action adds a new main';
  }

  findAll() {
    return `This action returns all main`;
  }

  findOne(id: number) {
    return `This action returns a #${id} main`;
  }

  update(id: number, updateMainDto: UpdateMainDto) {
    return `This action updates a #${id} main`;
  }

  remove(id: number) {
    return `This action removes a #${id} main`;
  }
}
