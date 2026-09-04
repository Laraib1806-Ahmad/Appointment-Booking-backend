import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { Clinic } from '../clinics/clinic.entity';
import { Schedule } from '../schedules/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Clinic, Schedule])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
