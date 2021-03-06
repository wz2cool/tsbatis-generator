import * as fs from "fs";
import * as lodash from "lodash";
import * as path from "path";
import {
  column,
  ColumnInfo,
  ConnectionFactory,
  DynamicQuery,
  FilterDescriptor,
  FilterOperator,
  SqliteConnectionConfig
} from "tsbatis";
import * as util from "util";
import { SqliteMaster } from "../db/entity/table";
import { DbColumnInfo, TableName } from "../db/entity/view";
import { SqliteMasterMapper } from "../db/mapper";
import { CompressHelper, TemplateHelper } from "../helpers";
import { TextFileInfo } from "../model";

export class SqliteService {
  private numberTypes = [
    "INT",
    "INTEGER",
    "TINYINT",
    "SMALLINT",
    "MEDIUMINT",
    "BIGINT",
    "UNSIGNED BIGINT",
    "INT2",
    "INT8",
    "REAL",
    "DOUBLE",
    "DOUBLE PRECISION",
    "FLOAT",
    "NUMERIC",
    "DECIMAL"
  ];
  private stringTypes = [
    "CHAR",
    "VARCHAR",
    "VARYING CHARACTER",
    "NCHAR",
    "NATIVE CHARACTER",
    "NVARCHAR",
    "TEXT",
    "CLOB"
  ];
  private booleanTypes = ["BOOLEAN"];
  private dateTypes = ["DATE", "DATETIME"];

  public async getTableNames(sqliteFile: string): Promise<string[]> {
    try {
      await this.checkParamEmpty("sqliteFile", sqliteFile);
      await this.checkFileExists(sqliteFile);
      const config = new SqliteConnectionConfig();
      config.filepath = sqliteFile;
      const connectionFactory = new ConnectionFactory(config, true);
      const connection = await connectionFactory.getConnection();
      const sqliteMasterMapper = new SqliteMasterMapper(connection);
      const sqliteMasters = await sqliteMasterMapper.selectByDynamicQuery(
        new DynamicQuery()
      );
      const result = lodash.uniq(lodash.map(sqliteMasters, x => x.tblName));
      return result;
    } catch (e) {
      return new Promise<string[]>((resolve, reject) => reject(e));
    }
  }

  public async getDbColumnInfos(
    sqliteFile: string,
    tableName: string
  ): Promise<DbColumnInfo[]> {
    try {
      await this.checkParamEmpty("sqliteFile", sqliteFile);
      await this.checkParamEmpty("tableName", tableName);
      await this.checkFileExists(sqliteFile);
      const config = new SqliteConnectionConfig();
      config.filepath = sqliteFile;
      const connectionFactory = new ConnectionFactory(config, true);
      const connection = await connectionFactory.getConnection();
      const dbColumnInfos = await connection.selectEntities<DbColumnInfo>(
        DbColumnInfo,
        `PRAGMA table_info ("${tableName}")`,
        []
      );
      return dbColumnInfos;
    } catch (e) {
      return new Promise<DbColumnInfo[]>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntitiesZipFile(
    sqliteFile: string,
    tableNames: string[]
  ): Promise<string> {
    try {
      const textFileInfos = await this.generateTableEntities(
        sqliteFile,
        tableNames
      );
      const zipFile = await CompressHelper.compressTextFile(textFileInfos);
      return new Promise<string>((resolve, reject) => resolve(zipFile));
    } catch (e) {
      return new Promise<string>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntities(
    sqliteFile: string,
    tableNames: string[]
  ): Promise<TextFileInfo[]> {
    try {
      const result: TextFileInfo[] = [];
      for (const tableName of tableNames) {
        const textFileInfo = await this.generateTableEntity(
          sqliteFile,
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
    sqliteFile: string,
    tableName: string
  ): Promise<TextFileInfo> {
    try {
      const config = new SqliteConnectionConfig();
      config.filepath = sqliteFile;
      const connectionFactory = new ConnectionFactory(config, true);
      const connection = await connectionFactory.getConnection();
      const sqliteMasterMapper = new SqliteMasterMapper(connection);
      const tableFilter = new FilterDescriptor<SqliteMaster>(
        t => t.tblName,
        FilterOperator.EQUAL,
        tableName
      );
      const query = DynamicQuery.createIntance<SqliteMaster>().addFilters(
        tableFilter
      );
      const sqliteMasters = await sqliteMasterMapper.selectByDynamicQuery(
        query
      );
      if (sqliteMasters.length === 0) {
        return new Promise<TextFileInfo>((resolve, reject) =>
          reject(new Error(`cannot find table: "${tableName}"`))
        );
      }
      const createTableSql = sqliteMasters[0].sql;
      const autoIncrease =
        createTableSql.toLowerCase().indexOf("autoincrement") >= 0;

      const dbColumInfos = await this.getDbColumnInfos(sqliteFile, tableName);
      const columnInfos: ColumnInfo[] = [];
      for (const dbColInfo of dbColumInfos) {
        const columnInfo = new ColumnInfo();
        const tsProp = lodash.camelCase(dbColInfo.name);
        const tsType = this.convertToTsType(dbColInfo.type);
        columnInfo.columnName = dbColInfo.name;
        columnInfo.property = tsProp;
        columnInfo.propertyType = tsType;
        columnInfo.isPK = dbColInfo.pk > 0;
        columnInfo.autoIncrease = columnInfo.isPK ? autoIncrease : false;
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

    for (const element of this.booleanTypes) {
      if (useDbType.indexOf(element) === 0) {
        return "boolean";
      }
    }

    for (const element of this.dateTypes) {
      if (useDbType.indexOf(element) === 0) {
        return "Date";
      }
    }

    return "string";
  }

  private checkFileExists(sqliteFile: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.exists(sqliteFile, exists => {
        if (exists) {
          resolve();
        } else {
          reject(new Error(`can not find file: "${sqliteFile}"`));
        }
      });
    });
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
}
