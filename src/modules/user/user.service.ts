import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.schema';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(findData: Partial<User>): Promise<User | null> {
    return await this.userRepository
      .findOne({ where: findData as any })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  async findByEmail(
    options: Partial<{ email: string }>,
  ): Promise<Optional<User>> {
    const user = await this.userRepository
      .findOne({
        where: { email: options.email },
        select: ['id', 'email', 'password', 'firstName', 'lastName', 'role'],
      })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return user!;
  }

  async createUser(userRegisterDto: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userRegisterDto);
    return await this.userRepository.save(user).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ order: { createdAt: 'DESC' } });
  }
}
