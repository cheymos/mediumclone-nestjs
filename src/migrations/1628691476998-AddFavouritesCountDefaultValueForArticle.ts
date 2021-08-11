import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavouritesCountDefaultValueForArticle1628691476998 implements MigrationInterface {
    name = 'AddFavouritesCountDefaultValueForArticle1628691476998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."articles" ALTER COLUMN "favoritesCount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."articles" ALTER COLUMN "favoritesCount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."articles" ALTER COLUMN "favoritesCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."articles" ALTER COLUMN "favoritesCount" DROP NOT NULL`);
    }

}
