import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1754396720105 implements MigrationInterface {
  name = 'Initial1754396720105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "middleName" character varying NOT NULL, "lastName" character varying NOT NULL, "company" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'male', "role" "public"."user_role_enum" NOT NULL DEFAULT 'seeker', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastVisit" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
