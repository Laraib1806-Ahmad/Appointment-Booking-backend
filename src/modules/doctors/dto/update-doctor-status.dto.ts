import { IsEnum } from 'class-validator';
import { DoctorStatus } from '../doctor.entity';

export class UpdateDoctorStatusDto {
  @IsEnum(DoctorStatus)
  status: DoctorStatus;
}
