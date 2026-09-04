import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Action } from '../../casl/userRoles';
import { Auth, AuthUser, Public } from '../../decorators';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: 'any', description: 'User info with access token' })
  async userLogin(@Body() userLoginDto: any): Promise<TokenPayloadDto> {
    const userEntity: User = await this.authService.validateUser(userLoginDto);
    return await this.authService.createAccessToken(userEntity);
  }

  @Auth(Action.Manage, 'User')
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: User, description: 'Successfully Registered' })
  async userRegister(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.userService.createUser(registerDto);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth(Action.Read, 'User')
  @ApiOkResponse({ type: User, description: 'current user info' })
  getCurrentUser(@AuthUser() user: User): User {
    return user;
  }
}
