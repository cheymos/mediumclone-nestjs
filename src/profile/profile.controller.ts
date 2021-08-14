import { Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { ProfileService } from './profile.service';
import { IProfileResponse } from './types/profile-response.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async find(@Param('username') profileUsername: string, @User('id') currentUserId: number): Promise<IProfileResponse> {
    const profile = await this.profileService.find(profileUsername, currentUserId);

    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(@User() currentUser: UserEntity, @Param('username') profileUsername: string): Promise<IProfileResponse> {
    const profile = await this.profileService.followProfile(currentUser, profileUsername);

    return this.profileService.buildProfileResponse(profile);
  }
}
