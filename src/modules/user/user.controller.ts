import { Get, HttpCode, Put, UseGuards } from '@nestjs/common';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { BackandValidationPipe } from '../../shared/pipes/backend-validation.pipe';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { IUserResponse } from './types/user-response.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new BackandValidationPipe())
  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @UsePipes(new BackandValidationPipe())
  @HttpCode(200)
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  currentUser(@User() user: UserEntity): IUserResponse {
    return this.userService.buildUserResponse(user);
  }

  @Put('users')
  @UseGuards(AuthGuard)
  async updateCurrentUser(@User('id') currentUserId: number, @Body('user') updateUserDto: UpdateUserDto): Promise<IUserResponse> {
    const user = await this.userService.updateUser(currentUserId, updateUserDto);

    return this.userService.buildUserResponse(user);
  }
}
