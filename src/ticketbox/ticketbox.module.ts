import { Module } from '@nestjs/common';
import { TicketboxService } from './ticketbox.service';
import { TicketboxController } from './ticketbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { QuestionRepository } from 'src/admin/question/question.repository';
import { SelectionRepository } from 'src/admin/selection/selection.repository';
import { SelectionService } from 'src/admin/selection/selection.service';
import { QuestionService } from 'src/admin/question/question.service';
import { AlcoholRepository } from 'src/admin/alcohol/alcohol.repository';
import { MovieRepository } from './movie/movie.repository';
import { AlcoholService } from 'src/admin/alcohol/alcohol.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionRepository, SelectionRepository, AlcoholRepository, MovieRepository])
  ],
  controllers: [TicketboxController],
  providers: [TicketboxService, SelectionService, QuestionService, AlcoholService],
  exports: [QuestionService, SelectionService]
})
export class TicketboxModule {}
