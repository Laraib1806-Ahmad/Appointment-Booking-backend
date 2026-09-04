import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Clinic } from '../clinics/clinic.entity';
import { Schedule } from '../schedules/schedule.entity';

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Clinic) private clinicRepository: Repository<Clinic>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}
  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const clinic = await this.clinicRepository.findOne({
      where: { id: dto.clinicId },
    });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    const startsAt = new Date(dto.startsAt);
    const dayName = WEEKDAYS[startsAt.getUTCDay()];

    const schedule = await this.scheduleRepository.findOne({
      where: { clinicId: dto.clinicId, day: dayName as any },
    });
    if (!schedule) {
      throw new BadRequestException(`Clinic is not open on ${dayName}`);
    }

    const endsAt = new Date(
      startsAt.getTime() + schedule.slotDurationMinutes * 60000,
    );

    // Overlap check
    const conflict = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.clinicId = :clinicId', { clinicId: dto.clinicId })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.BOOKED,
      })
      .andWhere('appointment.startsAt < :endsAt', { endsAt })
      .andWhere('appointment.endsAt > :startsAt', { startsAt })
      .getOne();

    if (conflict) {
      throw new ConflictException('This time slot is already booked');
    }

    const appointment = this.appointmentRepository.create({
      doctorId: clinic.doctorId,
      clinicId: dto.clinicId,
      patientName: dto.patientName,
      patientEmail: dto.patientEmail,
      startsAt,
      endsAt,
      status: AppointmentStatus.BOOKED,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async cancel(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentRepository.save(appointment);
  }

  async findByPatientEmail(email: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patientEmail: email },
      order: { startsAt: 'DESC' },
    });
  }
}
