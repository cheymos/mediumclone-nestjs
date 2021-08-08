import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTags1628413062513 implements MigrationInterface {
  name = 'CreateTags1628413062513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE tags (id int generated always as identity primary key, name varchar(150) NOT NULL)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
