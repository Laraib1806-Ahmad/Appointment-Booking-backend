import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';
import { Schedule } from '../schedules/schedule.entity';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.clinics)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column()
  doctorId: string;

  @Column()
  clinicName: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @OneToMany(() => Schedule, (schedule) => schedule.clinic)
  schedules: Schedule[];
}
