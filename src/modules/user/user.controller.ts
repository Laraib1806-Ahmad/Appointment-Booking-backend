import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { Auth, AuthUser } from '../../decorators';
import { User } from './user.schema';
import { Action } from '../../casl/userRoles';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('users controller');
  }

  @Get()
  @Auth(Action.Read, 'User')
  @HttpCode(HttpStatus.OK)
  getUsers(@AuthUser() user: User): Promise<User[]> {
    this.loggerService.log(`GET User/ ${LoggerMessages.API_CALLED}`);
    return this.userService.getUsers();
  }
}
