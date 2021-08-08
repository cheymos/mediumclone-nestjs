import { UserEntity } from '../user.entity';

export interface IUserResponse {
  user: UserType & { token: string };
}

type UserType = Omit<UserEntity, 'hashingPassword'>;
