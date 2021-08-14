import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFollows1628967326581 implements MigrationInterface {
    name = 'CreateFollows1628967326581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "PK_105079775692df1f8799ed0fac8" PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`);
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}
