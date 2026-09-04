import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }
    const schedule = this.scheduleRepository.create(dto);
    return this.scheduleRepository.save(schedule);
  }

  async findByClinic(clinicId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({ where: { clinicId } });
  }
}
