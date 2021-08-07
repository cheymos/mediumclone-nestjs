import { ConnectionOptions } from 'typeorm';

export const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'mediumclone',
  username: 'mediumclone',
  password: 'mediumclone',
  applicationName: 'MediumClone on Nest!',
  entities: [__dirname + '/**/*.model{.ts,.js}'],
};
