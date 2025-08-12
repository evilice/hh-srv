import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1754979946801 implements MigrationInterface {
  name = 'Initial1754979946801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."test_entity_gender_enum" AS ENUM('iq', 'psy', 'special')`,
    );
    await queryRunner.query(
      `CREATE TABLE "test_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "gender" "public"."test_entity_gender_enum" DEFAULT 'iq', "is_active" boolean NOT NULL DEFAULT true, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "PK_cc0413536e3afc0e586996bea40" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD CONSTRAINT "FK_2539e07510411f1177f85ca1e58" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_entity" DROP CONSTRAINT "FK_2539e07510411f1177f85ca1e58"`,
    );
    await queryRunner.query(`DROP TABLE "test_entity"`);
    await queryRunner.query(`DROP TYPE "public"."test_entity_gender_enum"`);
  }
}
