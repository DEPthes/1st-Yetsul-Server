import { PartialType } from '@nestjs/swagger';
import { CreateSelectionDto } from './create-selection.dto';

export class UpdateSelectionDto extends PartialType(CreateSelectionDto) {}
