import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1754934821059 implements MigrationInterface {
  name = 'Initial1754934821059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vacancy_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "salary_min" character varying, "salary_max" character varying, "is_active" boolean NOT NULL DEFAULT true, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "employer_id" integer NOT NULL, CONSTRAINT "PK_d18e2b08a83e0df760e2f57e598" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancy_entity" ADD CONSTRAINT "FK_c186d683c9702f0556dc637b079" FOREIGN KEY ("employer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vacancy_entity" DROP CONSTRAINT "FK_c186d683c9702f0556dc637b079"`,
    );
    await queryRunner.query(`DROP TABLE "vacancy_entity"`);
  }
}
