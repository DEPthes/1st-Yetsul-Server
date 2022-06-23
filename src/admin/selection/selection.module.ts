import { Module } from '@nestjs/common';
import { SelectionService } from './selection.service';
import { SelectionController } from './selection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelectionRepository } from './selection.repository';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([SelectionRepository])
  ],
  controllers: [SelectionController],
  providers: [SelectionService]
})
export class SelectionModule {}



