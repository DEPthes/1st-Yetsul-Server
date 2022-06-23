import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionRepository]), NestjsFormDataModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}

