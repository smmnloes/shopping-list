import { MigrationInterface, QueryRunner } from "typeorm";

export class TrimListItems1747502705744 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE list_item
            SET name = TRIM(name)
            WHERE name IS NOT NULL;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
