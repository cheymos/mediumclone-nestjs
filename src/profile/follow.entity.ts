import { UserEntity } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('follows')
export class FollowEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { primary: true })
  @JoinColumn()
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { primary: true })
  @JoinColumn()
  following: UserEntity;
}
