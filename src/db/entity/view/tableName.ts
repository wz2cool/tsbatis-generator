import { column, Entity } from "tsbatis";

export class TableName extends Entity {
    @column("name")
    public name: string;
}
