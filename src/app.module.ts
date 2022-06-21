import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
