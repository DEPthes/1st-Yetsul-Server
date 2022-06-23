import { Module } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';
import { AlcoholController } from './alcohol.controller';
import { AlcoholRepository } from './alcohol.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlcoholRepository]),
  ],
  controllers: [AlcoholController],
  providers: [AlcoholService]
})
export class AlcoholModule {}
