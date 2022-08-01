import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { QuestionModule } from './admin/question/question.module';
import { SelectionModule } from './admin/selection/selection.module';
import { AlcoholModule } from './admin/alcohol/alcohol.module';
import { TicketboxModule } from './Client/ticketbox/ticketbox.module';
import { RecommendationModule } from './Client/recommendation/recommendation.module';
import { ReviewModule } from './Client/alcoholList/review/review.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), 
    TicketboxModule, QuestionModule, SelectionModule, AlcoholModule, RecommendationModule, ReviewModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}