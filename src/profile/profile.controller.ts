import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
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
}
