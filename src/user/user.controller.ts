import { Get, HttpCode, Req, ValidationPipe } from '@nestjs/common';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { IExpressRequest } from 'src/types/expressRequest.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserResponse } from './types/user-response.interface';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get('users')
  currentUser(@Req() req: IExpressRequest): IUserResponse {
    return this.userService.buildUserResponse(req.user);
  }
}
