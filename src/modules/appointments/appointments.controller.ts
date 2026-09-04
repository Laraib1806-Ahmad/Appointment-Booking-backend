import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';

@Controller('appointments')
@UseInterceptors(ResponseInterceptor)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(id);
  }

  @Get()
  async findByEmail(@Query('email') email: string) {
    return this.appointmentsService.findByPatientEmail(email);
  }
}
