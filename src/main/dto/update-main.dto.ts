import { PartialType } from '@nestjs/mapped-types';
import { CreateMainDto } from './create-main.dto';

export class UpdateMainDto extends PartialType(CreateMainDto) {}
