import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { generateHash } from '../../common/utils';
import { RoleType } from '../../constants/role-type';

export type UserDocument = User;

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Column()
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Column()
  lastName: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @MinLength(5)
  @Column({ select: false })
  password: string;

  @IsString()
  @MinLength(11)
  @MaxLength(14)
  @Column()
  phone: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  avatar: string;

  @IsEnum(RoleType)
  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPasswordOnInsert() {
    this.password = generateHash(this.password);
  }
}
