import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @Min(0)
  @IsInt()
  homeScore: number;

  @Min(0)
  @IsInt()
  awayScore: number;

  @IsBoolean()
  @IsOptional()
  finished?: boolean;
}
