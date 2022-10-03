import { Module } from '@nestjs/common';
import { TicketboxService } from './ticketbox.service';
import { TicketboxController } from './ticketbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionRepository } from 'src/Repository/question.repository';
import { SelectionService } from 'src/admin/selection/selection.service';
import { QuestionService } from 'src/admin/question/question.service';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';
import { MovieRepository } from '../../Repository/movie.repository';
import { SelectionRepository } from 'src/Repository/selection.repository';
import { IntroductionAlcoholService } from '../alcoholList/introductionAlcohol/introductionAlcohol.service';
import { LikeRepository } from 'src/Repository/like.repository';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionRepository, SelectionRepository, AlcoholRepository, MovieRepository, LikeRepository, UserRepository])
  ],
  controllers: [TicketboxController],
  providers: [TicketboxService, SelectionService, QuestionService, IntroductionAlcoholService],
  exports: [QuestionService, SelectionService]
})
export class TicketboxModule {}
