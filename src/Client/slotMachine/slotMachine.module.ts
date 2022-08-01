import { Module } from '@nestjs/common';
import { slotMachineService } from './slotMachine.service';
import { slotMachineController } from './slotMachine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlcoholRepository } from 'src/Repository/alcohol.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlcoholRepository])
  ],
  controllers: [slotMachineController],
  providers: [slotMachineService]
})
export class slotMachineModule {}
