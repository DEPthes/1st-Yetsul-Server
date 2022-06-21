import { Module } from '@nestjs/common';
import { SelectionService } from './selection.service';
import { SelectionController } from './selection.controller';

@Module({
  controllers: [SelectionController],
  providers: [SelectionService]
})
export class SelectionModule {}
