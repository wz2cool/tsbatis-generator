import * as lodash from "lodash";
import {
  column,
  ColumnInfo,
  ConnectionFactory,
  DynamicQuery,
  FilterCondition,
  FilterDescriptor,
  FilterOperator,
  MysqlConnectionConfig
} from "tsbatis";
import * as util from "util";
import { MysqlTableInfo } from "../db/entity/table";
import { DbColumnInfo } from "../db/entity/view";
import { MysqlTableInfoMapper } from "../db/mapper";
import { CompressHelper, TemplateHelper } from "../helpers";
import { TextFileInfo } from "../model";

export class MysqlService {
  private numberTypes = [
    "TINYINT",
    "SMALLINT",
    "MEDIUMINT",
    "INT",
    "INTEGER",
    "BIGINT",
    "FLOAT",
    "DOUBLE",
    "DECIMAL",
    "BIT"
  ];
  private stringTypes = [
    "CHAR",
    "VARCHAR",
    "TINYBLOB",
    "TINYTEXT",
    "BLOB",
    "TEXT",
    "MEDIUMBLOB",
    "MEDIUMTEXT",
    "LONGBLOB",
    "LONGTEXT"
  ];
  private dateTypes = ["DATE", "DATETIME"];

  public async getTableNames(
    uri: string,
    user: string,
    pwd: string,
    database: string
  ): Promise<string[]> {
    try {
      await this.checkParamEmpty("uri", uri);
      await this.checkParamEmpty("user", user);
      await this.checkParamEmpty("pwd", pwd);
      await this.checkParamEmpty("database", database);

      const uriInfos = uri.split(":");
      const host = uriInfos[0];
      const port = uriInfos[1];

      const config = new MysqlConnectionConfig();
      config.host = host;
      config.port = parseInt(port, 10);
      config.user = user;
      config.password = pwd;
      config.database = database;

      const connectionFactory = new ConnectionFactory(config, true);
      const connection = await connectionFactory.getConnection();
      const mysqlTableInfoMapper = new MysqlTableInfoMapper(connection);
      const dbFilter = new FilterDescriptor<MysqlTableInfo>(
        u => u.tableSchema,
        FilterOperator.EQUAL,
        database
      );
      const query = DynamicQuery.createIntance<MysqlTableInfo>().addFilters(
        dbFilter
      );
      const mysqlTableInfos = await mysqlTableInfoMapper.selectByDynamicQuery(
        query
      );
      const result = lodash.uniq(lodash.map(mysqlTableInfos, x => x.tableName));
      return result;
    } catch (e) {
      return new Promise<string[]>((resolve, reject) => reject(e));
    }
  }

  public async getDbColumnInfos(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableName: string
  ): Promise<DbColumnInfo[]> {
    try {
      await this.checkParamEmpty("uri", uri);
      await this.checkParamEmpty("user", user);
      await this.checkParamEmpty("pwd", pwd);
      await this.checkParamEmpty("database", database);
      await this.checkParamEmpty("tableName", tableName);
      const uriInfos = uri.split(":");
      const host = uriInfos[0];
      const port = uriInfos[1];
      const config = new MysqlConnectionConfig();
      config.host = host;
      config.port = parseInt(port, 10);
      config.user = user;
      config.password = pwd;
      config.database = database;

      const sql =
        `SELECT COLUMN_NAME AS name, DATA_TYPE AS type, column_comment AS comment,` +
        `(CASE WHEN COLUMN_KEY = 'PRI' THEN 1 ELSE 0 END) AS pk, ` +
        `(CASE WHEN extra = 'auto_increment' THEN 1 ELSE 0 END) as auto_increment ` +
        `FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${tableName}'`;

      const connectionFactory = new ConnectionFactory(config, true);
      const connection = await connectionFactory.getConnection();
      const dbColumnInfos = await connection.selectEntities<DbColumnInfo>(
        DbColumnInfo,
        sql,
        []
      );
      return dbColumnInfos;
    } catch (e) {
      return new Promise<DbColumnInfo[]>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntitiesZipFile(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableNames: string[]
  ): Promise<string> {
    try {
      const textFileInfos = await this.generateTableEntities(
        uri,
        user,
        pwd,
        database,
        tableNames
      );
      const zipFile = await CompressHelper.compressTextFile(textFileInfos);
      return new Promise<string>((resolve, reject) => resolve(zipFile));
    } catch (e) {
      return new Promise<string>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntities(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableNames: string[]
  ): Promise<TextFileInfo[]> {
    try {
      const result: TextFileInfo[] = [];
      for (const tableName of tableNames) {
        const textFileInfo = await this.generateTableEntity(
          uri,
          user,
          pwd,
          database,
          tableName
        );
        result.push(textFileInfo);
      }
      return new Promise<TextFileInfo[]>((resolve, reject) => resolve(result));
    } catch (e) {
      return new Promise<TextFileInfo[]>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntity(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableName: string
  ): Promise<TextFileInfo> {
    try {
      const dbColumInfos = await this.getDbColumnInfos(
        uri,
        user,
        pwd,
        database,
        tableName
      );
      const columnInfos: ColumnInfo[] = [];
      for (const dbColumInfo of dbColumInfos) {
        const columnInfo = new ColumnInfo();
        const tsProp = lodash.camelCase(dbColumInfo.name);
        const tsType = this.convertToTsType(dbColumInfo.type);
        columnInfo.columnName = dbColumInfo.name;
        columnInfo.property = tsProp;
        columnInfo.propertyType = tsType;
        columnInfo.isPK = dbColumInfo.pk > 0 ? true : false;
        columnInfo.autoIncrease = dbColumInfo.autoIncrement > 0 ? true : false;
        columnInfos.push(columnInfo);
      }

      const content = TemplateHelper.generateTableEntity(
        tableName,
        columnInfos
      );
      const textFileInfo = new TextFileInfo();
      textFileInfo.fileName = lodash.camelCase(tableName) + ".ts";
      textFileInfo.content = content;
      return new Promise<TextFileInfo>((resolve, reject) =>
        resolve(textFileInfo)
      );
    } catch (e) {
      return new Promise<TextFileInfo>((resolve, reject) => reject(e));
    }
  }

  private checkParamEmpty(
    paramName: string,
    paramValue: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (util.isNullOrUndefined(paramValue)) {
        reject(new Error(`"${paramName}" can not be empty!`));
      } else {
        resolve();
      }
    });
  }

  private convertToTsType(dbType: string): string {
    const useDbType = dbType.toUpperCase();
    for (const element of this.numberTypes) {
      if (useDbType.indexOf(element) === 0) {
        return "number";
      }
    }

    for (const element of this.stringTypes) {
      if (useDbType.indexOf(element) === 0) {
        return "string";
      }
    }

    for (const element of this.dateTypes) {
      if (useDbType.indexOf(element) === 0) {
        return "Date";
      }
    }

    return "string";
  }
}
