import { DatabaseType } from "tsbatis";
import { DbColumnInfo } from "../db/entity/view";

export abstract class EntityFileInterpreterBase {
  public readonly databaseType: DatabaseType;

  constructor(databaseType: DatabaseType) {
    this.databaseType = databaseType;
  }

  public abstract interpret(
    tableName: string,
    dbColumnInfos: DbColumnInfo[]
  ): string;
}
