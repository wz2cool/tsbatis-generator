import { column, TableEntity } from "tsbatis";

export class MysqlTableInfo extends TableEntity {
    @column("TABLE_SCHEMA")
    public tableSchema: string;
    @column("TABLE_NAME")
    public tableName: string;

    public getTableName(): string {
        return "information_schema.tables";
    }
}
