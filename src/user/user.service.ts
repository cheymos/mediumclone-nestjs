import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { IUserResponse } from './types/user-response.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({ email: createUserDto.email });
    const userByUsername = await this.userRepository.findOne({ username: createUserDto.username });

    if (userByEmail || userByUsername) {
      throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    return this.userRepository.save(newUser);
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  private generateJwt(user: UserEntity): string {
    const { id, username, email } = user;

    return sign({ id, username, email }, JWT_SECRET);
  }
}
