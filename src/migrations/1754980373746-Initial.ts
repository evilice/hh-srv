import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1754980373746 implements MigrationInterface {
  name = 'Initial1754980373746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_entity" DROP CONSTRAINT "FK_2539e07510411f1177f85ca1e58"`,
    );
    await queryRunner.query(`ALTER TABLE "test_entity" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "public"."test_entity_gender_enum"`);
    await queryRunner.query(
      `ALTER TABLE "test_entity" DROP COLUMN "is_active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."test_entity_type_enum" AS ENUM('iq', 'psy', 'special')`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD "type" "public"."test_entity_type_enum" NOT NULL DEFAULT 'iq'`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD "createdById" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD CONSTRAINT "FK_fced48a5506e7a040e12de5ddf1" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_entity" DROP CONSTRAINT "FK_fced48a5506e7a040e12de5ddf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" DROP COLUMN "createdById"`,
    );
    await queryRunner.query(`ALTER TABLE "test_entity" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "test_entity" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."test_entity_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD "created_by" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."test_entity_gender_enum" AS ENUM('iq', 'psy', 'special')`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD "gender" "public"."test_entity_gender_enum" DEFAULT 'iq'`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_entity" ADD CONSTRAINT "FK_2539e07510411f1177f85ca1e58" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
