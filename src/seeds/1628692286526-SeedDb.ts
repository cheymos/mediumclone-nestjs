import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1628692286526 implements MigrationInterface {
  name = 'SeedDb1628692286526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO tags(name) VALUES('dragons'), ('coffee'), ('nestjs')`);

    // email: foo@foo.ru    password: foo 
    await queryRunner.query(`INSERT INTO users(username, email, password) VALUES('foo', 'foo@foo.ru', '$2b$10$163eIiUSDhzBgW.HNxvdguOQrXHo/R8jm/A3bsUH82qiOV5KprID2')`);

    await queryRunner.query(`INSERT INTO articles(slug, title, description, body, "tagList", "authorId") VALUES('first-article', 'first article title', 'first article desc', 'first article body', '{"coffee", "dragons"}', 1)`);

    await queryRunner.query(`INSERT INTO articles(slug, title, description, body, "tagList", "authorId") VALUES('second-article', 'second article title', 'second article desc', 'second article body', '{"coffee", "dragons"}', 1)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
