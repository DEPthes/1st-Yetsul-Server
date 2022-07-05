import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { QuestionModule } from './admin/question/question.module';
import { SelectionModule } from './admin/selection/selection.module';
import { AlcoholModule } from './admin/alcohol/alcohol.module';
import { TicketboxModule } from './ticketbox/ticketbox.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { MainModule } from './main/main.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), 
    TicketboxModule, QuestionModule, SelectionModule, AlcoholModule, RecommendationModule, MainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
