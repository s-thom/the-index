import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1609113537040 implements MigrationInterface {
    name = 'Initial1609113537040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" text NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "deleted" datetime,
                CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_auth" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "type" text NOT NULL,
                "secret" text NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "deleted" datetime,
                "userId" integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" text NOT NULL,
                "userId" integer,
                CONSTRAINT "UQ_0daf7567fa18bf86b777c5a9d89" UNIQUE ("name", "userId")
            )
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
                CONSTRAINT "UQ_e717aab924c3f1cf0d66621f0f4" UNIQUE ("reference")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e717aab924c3f1cf0d66621f0f" ON "links" ("reference")
        `);
        await queryRunner.query(`
            CREATE TABLE "links_tags_tags" (
                "linksId" integer NOT NULL,
                "tagsId" integer NOT NULL,
                PRIMARY KEY ("linksId", "tagsId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e73c050308182040b9b83c70d7" ON "links_tags_tags" ("linksId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c2179d4ffc5f90dee734fc1f98" ON "links_tags_tags" ("tagsId")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user_auth" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "type" text NOT NULL,
                "secret" text NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "deleted" datetime,
                "userId" integer,
                CONSTRAINT "FK_52403f2133a7b1851d8ab4dc9db" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user_auth"(
                    "id",
                    "type",
                    "secret",
                    "created",
                    "updated",
                    "deleted",
                    "userId"
                )
            SELECT "id",
                "type",
                "secret",
                "created",
                "updated",
                "deleted",
                "userId"
            FROM "user_auth"
        `);
        await queryRunner.query(`
            DROP TABLE "user_auth"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user_auth"
                RENAME TO "user_auth"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_tags" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" text NOT NULL,
                "userId" integer,
                CONSTRAINT "UQ_0daf7567fa18bf86b777c5a9d89" UNIQUE ("name", "userId"),
                CONSTRAINT "FK_92e67dc508c705dd66c94615576" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_tags"("id", "name", "userId")
            SELECT "id",
                "name",
                "userId"
            FROM "tags"
        `);
        await queryRunner.query(`
            DROP TABLE "tags"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_tags"
                RENAME TO "tags"
        `);
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
        await queryRunner.query(`
            DROP INDEX "IDX_e73c050308182040b9b83c70d7"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_c2179d4ffc5f90dee734fc1f98"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_links_tags_tags" (
                "linksId" integer NOT NULL,
                "tagsId" integer NOT NULL,
                CONSTRAINT "FK_e73c050308182040b9b83c70d7a" FOREIGN KEY ("linksId") REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_c2179d4ffc5f90dee734fc1f98e" FOREIGN KEY ("tagsId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                PRIMARY KEY ("linksId", "tagsId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_links_tags_tags"("linksId", "tagsId")
            SELECT "linksId",
                "tagsId"
            FROM "links_tags_tags"
        `);
        await queryRunner.query(`
            DROP TABLE "links_tags_tags"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_links_tags_tags"
                RENAME TO "links_tags_tags"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e73c050308182040b9b83c70d7" ON "links_tags_tags" ("linksId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c2179d4ffc5f90dee734fc1f98" ON "links_tags_tags" ("tagsId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_c2179d4ffc5f90dee734fc1f98"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_e73c050308182040b9b83c70d7"
        `);
        await queryRunner.query(`
            ALTER TABLE "links_tags_tags"
                RENAME TO "temporary_links_tags_tags"
        `);
        await queryRunner.query(`
            CREATE TABLE "links_tags_tags" (
                "linksId" integer NOT NULL,
                "tagsId" integer NOT NULL,
                PRIMARY KEY ("linksId", "tagsId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "links_tags_tags"("linksId", "tagsId")
            SELECT "linksId",
                "tagsId"
            FROM "temporary_links_tags_tags"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_links_tags_tags"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c2179d4ffc5f90dee734fc1f98" ON "links_tags_tags" ("tagsId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e73c050308182040b9b83c70d7" ON "links_tags_tags" ("linksId")
        `);
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
                CONSTRAINT "UQ_e717aab924c3f1cf0d66621f0f4" UNIQUE ("reference")
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
        await queryRunner.query(`
            ALTER TABLE "tags"
                RENAME TO "temporary_tags"
        `);
        await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" text NOT NULL,
                "userId" integer,
                CONSTRAINT "UQ_0daf7567fa18bf86b777c5a9d89" UNIQUE ("name", "userId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "tags"("id", "name", "userId")
            SELECT "id",
                "name",
                "userId"
            FROM "temporary_tags"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_tags"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_auth"
                RENAME TO "temporary_user_auth"
        `);
        await queryRunner.query(`
            CREATE TABLE "user_auth" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "type" text NOT NULL,
                "secret" text NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "deleted" datetime,
                "userId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user_auth"(
                    "id",
                    "type",
                    "secret",
                    "created",
                    "updated",
                    "deleted",
                    "userId"
                )
            SELECT "id",
                "type",
                "secret",
                "created",
                "updated",
                "deleted",
                "userId"
            FROM "temporary_user_auth"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user_auth"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_c2179d4ffc5f90dee734fc1f98"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_e73c050308182040b9b83c70d7"
        `);
        await queryRunner.query(`
            DROP TABLE "links_tags_tags"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_e717aab924c3f1cf0d66621f0f"
        `);
        await queryRunner.query(`
            DROP TABLE "links"
        `);
        await queryRunner.query(`
            DROP TABLE "tags"
        `);
        await queryRunner.query(`
            DROP TABLE "user_auth"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_51b8b26ac168fbe7d6f5653e6c"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
