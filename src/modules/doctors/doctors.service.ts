import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Doctor, DoctorStatus } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
  ) {}

  async register(dto: CreateDoctorDto): Promise<Partial<Doctor>> {
    const existing = await this.doctorRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const doctor = this.doctorRepository.create({
      ...dto,
      password: hashedPassword,
      status: DoctorStatus.PENDING,
    });
    const saved = await this.doctorRepository.save(doctor);

    const { password, ...doctorWithoutPassword } = saved;
    return doctorWithoutPassword;
  }

  async findAll(specialty?: string): Promise<Doctor[]> {
    const where = specialty
      ? { specialty, status: DoctorStatus.VERIFIED }
      : { status: DoctorStatus.VERIFIED };
    return this.doctorRepository.find({ where });
  }

  async getDistinctSpecialties(): Promise<string[]> {
    const rows = await this.doctorRepository
      .createQueryBuilder('doctor')
      .select('DISTINCT doctor.specialty', 'specialty')
      .where('doctor.status = :status', { status: DoctorStatus.VERIFIED })
      .getRawMany();
    return rows.map((r) => r.specialty);
  }

  async findAllForAdmin(status?: DoctorStatus): Promise<Doctor[]> {
    const where = status ? { status } : {};
    return this.doctorRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async updateStatus(id: string, status: DoctorStatus): Promise<Doctor> {
    const doctor = await this.findOne(id);
    doctor.status = status;
    return this.doctorRepository.save(doctor);
  }

  async findOneWithSchedule(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['clinics', 'clinics.schedules'],
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }
}
