import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNotePubliclyVisibleWhereNull1734182460107 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('Setting publiclyVisible to 1 where it is NULL')
        await queryRunner.query(
          `UPDATE note
           SET publiclyVisible = 1
           WHERE publiclyVisible IS NULL;`,
        )
        console.log('Success')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
