import { column, TableEntity } from "tsbatis";

export class SqliteMaster extends TableEntity {
    @column("type")
    public type: string;
    @column("name")
    public name: string;
    @column("tbl_name")
    public tblName: string;
    @column("rootpage")
    public rootpage: number;
    @column("sql")
    public sql: string;

    public getTableName(): string {
        return "sqlite_master";
    }
}
