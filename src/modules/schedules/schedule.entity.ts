import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Clinic } from '../clinics/clinic.entity';

export enum Weekday {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.schedules)
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @Column()
  clinicId: string;

  @Column({ type: 'enum', enum: Weekday })
  day: Weekday;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 15 })
  slotDurationMinutes: number;
}
