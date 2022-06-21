import { Module } from '@nestjs/common';
import { QuestionService } from './ticketbox.service';
import { QuestionController } from './ticketbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionRepository } from './question.repository';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { SelectionRepository } from './selection.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionRepository, SelectionRepository]), NestjsFormDataModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
