import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';

@Controller('schedules')
@UseInterceptors(ResponseInterceptor)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(dto);
  }

  @Get('clinic/:clinicId')
  async findByClinic(@Param('clinicId') clinicId: string) {
    return this.schedulesService.findByClinic(clinicId);
  }
}
