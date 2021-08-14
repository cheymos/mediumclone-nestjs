import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { IProfileResponse } from './types/profile-response.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async find(profileUsername: string, currentUserId: number): Promise<ProfileType> {
    const user = await this.userRepository.findOne({ username: profileUsername });

    if (!user) throw new HttpException('Profile did not found', HttpStatus.NOT_FOUND);

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): IProfileResponse {
    delete profile.email;

    return { profile };
  }
}
