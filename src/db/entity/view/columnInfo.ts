import { column, Entity } from "tsbatis";

export class ColumnInfo extends Entity {
    @column("cid")
    public cid: number;
    @column("name")
    public name: string;
    @column("type")
    public type: string;
    @column("notnull")
    public notnull: number;
    @column("dflt_value")
    public dfltValue: string;
    @column("pk")
    public pk: number;
}