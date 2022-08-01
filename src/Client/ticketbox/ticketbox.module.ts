import { Module } from '@nestjs/common';
import { TicketboxService } from './ticketbox.service';
import { TicketboxController } from './ticketbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { QuestionRepository } from 'src/Repository/question.repository';
import { SelectionService } from 'src/admin/selection/selection.service';
import { QuestionService } from 'src/admin/question/question.service';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { MovieRepository } from '../../Repository/movie.repository';
import { AlcoholService } from 'src/admin/alcohol/alcohol.service';
import { SelectionRepository } from 'src/Repository/selection.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionRepository, SelectionRepository, AlcoholRepository, MovieRepository])
  ],
  controllers: [TicketboxController],
  providers: [TicketboxService, SelectionService, QuestionService, AlcoholService],
  exports: [QuestionService, SelectionService]
})
export class TicketboxModule {}
