import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { User } from '../../modules/user/user.schema';
import { RoleType } from '../../constants/role-type';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<any> {
    const existing = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    if (existing) {
      console.log('Admin already exists, skipping.');
      return;
    }

    const admin = this.userRepository.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin12345',
      phone: '03001234567',
      role: RoleType.ADMIN,
    });
    return this.userRepository.save(admin);
  }

  async drop(): Promise<any> {
    return this.userRepository.delete({ role: RoleType.ADMIN });
  }
}
