import { StringUtils } from "ts-commons";
import { JavaType } from "../model/constant/JavaType";
import { MySqlType } from "../model/constant/MysqlType";
import { ITypeInterpreter } from "./ITypeInterpreter";

export class MysqlToJavaTypeInterpreter implements ITypeInterpreter {
  public interpret(mysqlType: string): string | undefined {
    if (StringUtils.isBlank(mysqlType)) {
      return undefined;
    }

    switch (mysqlType.toUpperCase()) {
      case MySqlType.BIT:
      case MySqlType.BOOL:
      case MySqlType.BOOLEAN:
        return JavaType.BOOLEAN;
      case MySqlType.TINYINT:
      case MySqlType.SMALLINT:
      case MySqlType.MEDIUMINT:
      case MySqlType.INT:
      case MySqlType.INTEGER:
        return JavaType.INEGER;
      case MySqlType.BIGINT:
        return JavaType.LONG;
      case MySqlType.FLOAT:
        return JavaType.FLOAT;
      case MySqlType.DOUBLE:
        return JavaType.DOUBLE;
      case MySqlType.DECIMAL:
        return JavaType.BIG_DECIMAL;
      case MySqlType.DATE:
      case MySqlType.YEAR:
        return JavaType.DATE;
      case MySqlType.TIMESTAMP:
      case MySqlType.DATETIME:
        return JavaType.TIMESTAMP;
      case MySqlType.TIME:
        return JavaType.TIME;
      case MySqlType.CHAR:
      case MySqlType.VARCHAR:
      case MySqlType.TINYTEXT:
      case MySqlType.TEXT:
      case MySqlType.MEDIUMTEXT:
      case MySqlType.LONGTEXT:
        return JavaType.STRING;
      case MySqlType.BINARY:
      case MySqlType.VARBINARY:
      case MySqlType.TINYBLOB:
      case MySqlType.BLOB:
      case MySqlType.MEDIUMBLOB:
      case MySqlType.LONGBLOB:
        return JavaType.BYTES;
    }
  }
}
