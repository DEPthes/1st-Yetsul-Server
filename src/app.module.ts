import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
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
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}