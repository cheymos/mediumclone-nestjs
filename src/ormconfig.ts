import { ConnectionOptions } from 'typeorm';

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: 'ella.db.elephantsql.com',
  port: 5432,
  database: 'nqcvjqcs',
  username: 'nqcvjqcs',
  password: 'gdK0uX3W747fwXVKOn-JrJecnAP9wG4O',
  applicationName: 'MediumClone on Nest!',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default ormconfig;
