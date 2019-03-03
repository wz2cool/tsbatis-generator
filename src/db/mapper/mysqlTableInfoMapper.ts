import { BaseTableMapper } from "tsbatis";
import { MysqlTableInfo } from "../entity/table";

export class MysqlTableInfoMapper extends BaseTableMapper<MysqlTableInfo> {
  public getEntityClass(): new () => MysqlTableInfo {
    return MysqlTableInfo;
  }
}
