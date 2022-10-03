import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { QuestionModule } from './admin/question/question.module';
import { SelectionModule } from './admin/selection/selection.module';
import { TicketboxModule } from './Client/boxOffice/ticketbox.module';
import { alcoholListModule } from './Client/alcoholList/alcoholList.module';
import { AuthModule } from './auth/auth.module';
import { slotMachineModule } from './Client/slotMachine/slotMachine.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}), // passport 등록
    JwtModule.register({ // jwt 등록
      secret: 'Secret1234', // process.env.JWT_SECRET || jwtConfig.secret, // secret: 'Secret1234', // 토큰 만들때 이용하는 비밀 키
      signOptions: {
        expiresIn: 60*60 // 60 * 60 // 몇초동안 토큰 유효한지
      }
    }),
    TypeOrmModule.forRoot(typeORMConfig), 
    TicketboxModule, QuestionModule, SelectionModule, slotMachineModule, alcoholListModule, AuthModule, UploadFileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}