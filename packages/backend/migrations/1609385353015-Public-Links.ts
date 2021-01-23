import {MigrationInterface, QueryRunner} from "typeorm";

export class PublicLinks1609385353015 implements MigrationInterface {
    name = 'PublicLinks1609385353015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "links"
                ADD COLUMN "visibility" text NOT NULL DEFAULT ('private')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "links"
                RENAME COLUMN "visibility" TO "visibility_e717aab924c3f1cf0d66621f0f4"
        `);
    }

}
