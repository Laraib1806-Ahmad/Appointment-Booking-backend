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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorStatus } from './doctor.entity';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { UpdateDoctorStatusDto } from './dto/update-doctor-status.dto';
import { Auth } from '../../decorators';
import { Action } from '../../casl/userRoles';

@Controller('doctors')
@UseInterceptors(ResponseInterceptor)
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.register(dto);
  }

  @Get()
  async findAll(@Query('specialty') specialty?: string) {
    return this.doctorsService.findAll(specialty);
  }

  @Get('admin/all')
  @Auth(Action.Manage, 'Doctor')
  async findAllForAdmin(@Query('status') status?: DoctorStatus) {
    return this.doctorsService.findAllForAdmin(status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id/status')
  @Auth(Action.Manage, 'Doctor')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDoctorStatusDto,
  ) {
    return this.doctorsService.updateStatus(id, dto.status);
  }

  @Get(':id/full')
  async findOneWithSchedule(@Param('id') id: string) {
    return this.doctorsService.findOneWithSchedule(id);
  }
}
