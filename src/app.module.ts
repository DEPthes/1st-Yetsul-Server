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
import { ReviewModule } from './review/review.module';
import { LoginModule } from './login/login.module';
import { GoogleStrategy } from './login/google.strategy';
import { LoginService } from './login/login.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), 
    TicketboxModule, QuestionModule, SelectionModule, AlcoholModule, RecommendationModule, MainModule, ReviewModule, LoginModule],
  controllers: [AppController],
  providers: [AppService, LoginService, GoogleStrategy],
})
export class AppModule {}