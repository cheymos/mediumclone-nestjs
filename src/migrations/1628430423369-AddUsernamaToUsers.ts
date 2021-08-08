import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsernamaToUsers1628430423369 implements MigrationInterface {
    name = 'AddUsernamaToUsers1628430423369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "username" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "username"`);
    }

}
