import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getOrmConfig } from './ormconfig';

const ormseedconfig: TypeOrmModuleOptions = {
  ...getOrmConfig(),
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/seeds',
  },
};

export default ormseedconfig;
