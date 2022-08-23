import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { QuestionModule } from './admin/question/question.module';
import { SelectionModule } from './admin/selection/selection.module';
import { AlcoholModule } from './admin/alcohol/alcohol.module';
import { TicketboxModule } from './Client/boxOffice/ticketbox.module';
import { alcoholListModule } from './Client/alcoholList/alcoholList.module';
import { AuthModule } from './auth/auth.module';
import { slotMachineModule } from './Client/slotMachine/slotMachine.module';
import { UploadFileModule } from './upload-file/upload-file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), 
    TicketboxModule, QuestionModule, SelectionModule, AlcoholModule, slotMachineModule, alcoholListModule, AuthModule, UploadFileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}