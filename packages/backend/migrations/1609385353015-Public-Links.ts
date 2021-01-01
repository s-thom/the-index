import {MigrationInterface, QueryRunner} from "typeorm";

export class PublicLinks1609385353015 implements MigrationInterface {
    name = 'PublicLinks1609385353015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_e717aab924c3f1cf0d66621f0f"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_links" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "reference" text NOT NULL,
                "url" text NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "deleted" datetime,
                "userId" integer,
                "visibility" text NOT NULL DEFAULT ('private'),
                CONSTRAINT "UQ_e717aab924c3f1cf0d66621f0f4" UNIQUE ("reference"),
                CONSTRAINT "FK_56668229b541edc1d0e291b4c3b" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_links"(
                    "id",
                    "reference",
                    "url",
                    "created",
                    "updated",
                    "deleted",
                    "userId"
                )
            SELECT "id",
                "reference",
                "url",
                "created",
                "updated",
                "deleted",
                "userId"
            FROM "links"
        `);
        await queryRunner.query(`
            DROP TABLE "links"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_links"
                RENAME TO "links"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e717aab924c3f1cf0d66621f0f" ON "links" ("reference")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_e717aab924c3f1cf0d66621f0f"
        `);
        await queryRunner.query(`
            ALTER TABLE "links"
                RENAME TO "temporary_links"
        `);
        await queryRunner.query(`
            CREATE TABLE "links" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "reference" text NOT NULL,
                "url" text NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "deleted" datetime,
                "userId" integer,
                CONSTRAINT "UQ_e717aab924c3f1cf0d66621f0f4" UNIQUE ("reference"),
                CONSTRAINT "FK_56668229b541edc1d0e291b4c3b" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "links"(
                    "id",
                    "reference",
                    "url",
                    "created",
                    "updated",
                    "deleted",
                    "userId"
                )
            SELECT "id",
                "reference",
                "url",
                "created",
                "updated",
                "deleted",
                "userId"
            FROM "temporary_links"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_links"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e717aab924c3f1cf0d66621f0f" ON "links" ("reference")
        `);
    }

}
