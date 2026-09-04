import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Clinic } from '../clinics/clinic.entity';

export enum DoctorStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  specialty: string;

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee: number;

  @Column({ nullable: true })
  pmdcNumber: string;

  @Column({ nullable: true })
  degreeUrl: string;

  @Column({ nullable: true, unique: true })
  cnicNumber: string;

  @Column({
    type: 'enum',
    enum: DoctorStatus,
    default: DoctorStatus.PENDING,
  })
  status: DoctorStatus;

  @OneToMany(() => Clinic, (clinic) => clinic.doctor)
  clinics: Clinic[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
