import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './ticketbox/question.module';
import { SelectionModule } from './selection/selection.module';

@Module({
  imports: [QuestionModule, SelectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
