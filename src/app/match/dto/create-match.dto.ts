import { Type } from 'class-transformer';
import { IsDate, IsInt, Min, MinDate, NotEquals } from 'class-validator';

export class CreateMatchDto {
  @IsInt({
    message: 'Home team ID must be an integer',
  })
  @Min(1, {
    message: 'Home team ID must be greater than 0',
  })
  homeTeamId: number;

  @IsInt({
    message: 'Away team ID must be an integer',
  })
  @Min(1, {
    message: 'Away team ID must be greater than 0',
  })
  @NotEquals('homeTeamId', {
    message: 'Home team and away team cannot be the same',
  })
  awayTeamId: number;

  @MinDate(new Date())
  @IsDate()
  @Type(() => Date)
  date: Date;
}
