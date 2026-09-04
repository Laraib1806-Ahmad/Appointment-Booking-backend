import { IsUUID, IsEnum, Matches, IsInt, Min } from 'class-validator';
import { Weekday } from '../schedule.entity';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateScheduleDto {
  @IsUUID()
  clinicId: string;

  @IsEnum(Weekday)
  day: Weekday;

  @Matches(TIME_REGEX)
  startTime: string;

  @Matches(TIME_REGEX)
  endTime: string;

  @IsInt()
  @Min(5)
  slotDurationMinutes: number;
}
