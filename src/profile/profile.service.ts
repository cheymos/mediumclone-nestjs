import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';
import { IProfileResponse } from './types/profile-response.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async find(profileUsername: string, currentUser: UserEntity): Promise<ProfileType> {
    const user = await this.findProfileByUsername(profileUsername);

    // Dont work!
    // const follow = await this.followRepository.findOne({ follower: { id: currentUser.id }, following: { id: user.id } });

    const follow = await this.followRepository
      .createQueryBuilder()
      .where({ follower: { id: currentUser.id }, following: { id: user.id } })
      .getRawOne();

    return { ...user, following: Boolean(follow) };
  }

  async followProfile(currentUser: UserEntity, profileUsername: string) {
    const user = await this.findProfileByUsername(profileUsername);

    if (user.id === currentUser.id) {
      throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST);
    }

    const follow = await this.followRepository.findOne({ follower: currentUser, following: user });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.follower = currentUser;
      followToCreate.following = user;

      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

  async unfollowProfile(currentUser: UserEntity, profileUsername: string) {
    const user = await this.findProfileByUsername(profileUsername);

    if (user.id === currentUser.id) {
      throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST);
    }

    await this.followRepository.delete({ follower: currentUser, following: user });

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): IProfileResponse {
    delete profile.email;

    return { profile };
  }

  private async findProfileByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ username });

    if (!user) throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);

    return user;
  }
}
