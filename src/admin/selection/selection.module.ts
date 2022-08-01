import { Module } from '@nestjs/common';
import { SelectionService } from './selection.service';
import { SelectionController } from './selection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { SelectionRepository } from 'src/Repository/selection.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SelectionRepository])
  ],
  controllers: [SelectionController],
  providers: [SelectionService]
})
export class SelectionModule {}



