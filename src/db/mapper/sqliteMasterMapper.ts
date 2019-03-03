import { BaseTableMapper } from "tsbatis";
import { SqliteMaster } from "../entity/table";

export class SqliteMasterMapper extends BaseTableMapper<SqliteMaster> {
  public getEntityClass(): new () => SqliteMaster {
    return SqliteMaster;
  }
}
