import { ConnectionOptions } from 'typeorm';
import ormconfig from './ormconfig';

const ormseedconfig: ConnectionOptions = {
  ...ormconfig,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/seeds',
  },
};

export default ormseedconfig;
