import * as _ from "lodash";

import { StringUtils } from "ts-commons";
import { DatabaseType } from "tsbatis";
import { DbColumnInfo } from "../db/entity/view";
import { EntityFileInterpreterBase } from "./EntityFileInterpreterBase";
import { ITypeInterpreter } from "./ITypeInterpreter";
import { MysqlToJavaTypeInterpreter } from "./MysqlToJavaTypeInterpreter";

export class JavaEntityFileInterpreter extends EntityFileInterpreterBase {
  private readonly typeInterpreter: ITypeInterpreter;

  constructor(databaseType: DatabaseType) {
    super(databaseType);

    if (databaseType === DatabaseType.MYSQL) {
      this.typeInterpreter = new MysqlToJavaTypeInterpreter();
    } else if (databaseType === DatabaseType.SQLITE3) {
      // TODO:
    }
  }

  public interpret(tableName: string, dbColumnInfos: DbColumnInfo[]): string {
    const className = _.startCase(_.camelCase(tableName.toLowerCase()));
    const privateFiledText = this.generatePriveFieldText(dbColumnInfos);
    const publicMothodText = this.genreatePublicMethodText(dbColumnInfos);
    const result =
      `import javax.persistence.*;\r\nimport java.sql.*;\r\n` +
      `@Table(name = "${tableName}")\r\n` +
      `public class ${className} {\r\n${privateFiledText}${publicMothodText}`;
    return result;
  }

  private generatePriveFieldText(dbColumnInfos: DbColumnInfo[]): string {
    const space = "    ";
    let result = "";
    for (const dbColumnInfo of dbColumnInfos) {
      const javaType = this.typeInterpreter.interpret(dbColumnInfo.type);
      const javaProperty = _.camelCase(dbColumnInfo.name.toLowerCase());
      if (StringUtils.isNotBlank(dbColumnInfo.comment)) {
        result += `${space}// ${dbColumnInfo.comment}\r\n`;
      }
      if (dbColumnInfo.pk === 1) {
        result += `${space}@Id\r\n`;
      }
      result += `${space}private ${javaType} ${javaProperty};\r\n`;
    }
    return result;
  }

  private genreatePublicMethodText(dbColumnInfos: DbColumnInfo[]): string {
    const space = "    ";
    let result = "";
    for (const dbColumnInfo of dbColumnInfos) {
      const javaType = this.typeInterpreter.interpret(dbColumnInfo.type);
      const javaProperty = _.camelCase(dbColumnInfo.name.toLowerCase());

      result +=
        `${space}public ${javaType} get${javaProperty} {\r\n` +
        `${space}${space}return ${javaProperty};\r\n` +
        `${space}}\r\n\r\n`;

      result +=
        `${space}public void set${javaProperty} {\r\n` +
        `${space}${space}this.${javaProperty} = ${javaProperty};\r\n` +
        `${space}}\r\n\r\n`;
    }
    return result;
  }
}
