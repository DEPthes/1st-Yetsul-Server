import { Module } from '@nestjs/common';
import { TicketboxService } from './ticketbox.service';
import { TicketboxController } from './ticketbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { QuestionRepository } from 'src/admin/question/question.repository';
import { SelectionRepository } from 'src/admin/selection/selection.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionRepository, SelectionRepository]), NestjsFormDataModule
  ],
  controllers: [TicketboxController],
  providers: [TicketboxService]
})
export class QuestionModule {}
