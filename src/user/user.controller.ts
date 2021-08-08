import { ValidationPipe } from '@nestjs/common';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './types/user-response.interface';
import { UserEntity } from './user.entity';
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
}
