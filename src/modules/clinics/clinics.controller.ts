import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { Auth } from '../../decorators';
import { Action } from '../../casl/userRoles';

@Controller('clinics')
@UseInterceptors(ResponseInterceptor)
export class ClinicsController {
  constructor(private clinicsService: ClinicsService) {}

  @Post()
  @Auth(Action.Manage, 'Clinic')
  async create(@Body() dto: CreateClinicDto) {
    return this.clinicsService.create(dto);
  }

  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId') doctorId: string) {
    return this.clinicsService.findByDoctor(doctorId);
  }
}
