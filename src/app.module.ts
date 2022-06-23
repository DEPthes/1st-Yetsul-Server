import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { QuestionModule } from './admin/question/question.module';
import { SelectionModule } from './admin/selection/selection.module';
import { AlcoholModule } from './admin/alcohol/alcohol.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), 
    QuestionModule, SelectionModule, AlcoholModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
