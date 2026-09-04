import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic) private clinicRepository: Repository<Clinic>,
  ) {}

  async create(dto: CreateClinicDto): Promise<Clinic> {
    const clinic = this.clinicRepository.create(dto);
    return this.clinicRepository.save(clinic);
  }

  async findByDoctor(doctorId: string): Promise<Clinic[]> {
    return this.clinicRepository.find({ where: { doctorId } });
  }
}
