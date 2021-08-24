import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('follows')
export class FollowEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { primary: true, eager: true })
  @JoinColumn()
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { primary: true, eager: true })
  @JoinColumn()
  following: UserEntity;
}
