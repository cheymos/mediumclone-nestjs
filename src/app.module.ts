import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOrmConfig } from './configs/ormconfig';
import { ArticleModule } from './modules/article/article.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(getOrmConfig()), TagModule, UserModule, ArticleModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
