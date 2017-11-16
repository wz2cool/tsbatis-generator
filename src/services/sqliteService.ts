import * as fs from "fs";
import * as lodash from "lodash";
import * as path from "path";
import { ConnectionFactory, DynamicQuery, SqliteConnectionConfig } from "tsbatis";
import * as util from "util";
import { SqliteMaster } from "../db/entity/table";
import { ColumnInfo, TableName } from "../db/entity/view";
import { SqliteMasterMapper } from "../db/mapper";

export class SqliteService {
    public async getTableNames(sqliteFile: string): Promise<string[]> {
        try {
            await this.checkParamEmpty("sqliteFile", sqliteFile);
            await this.checkFileExists(sqliteFile);
            const config = new SqliteConnectionConfig();
            config.filepath = sqliteFile;
            const connectionFactory = new ConnectionFactory(config, true);
            const connection = await connectionFactory.getConnection();
            const sqliteMasterMapper = new SqliteMasterMapper(connection);
            const sqliteMasters = await sqliteMasterMapper.selectByDynamicQuery(new DynamicQuery());
            const result = lodash.map(sqliteMasters, (x) => x.tblName);
            return result;
        } catch (e) {
            return new Promise<string[]>((resolve, reject) => reject(e));
        }
    }

    public async getColumnInfos(sqliteFile: string, tableName: string): Promise<ColumnInfo[]> {
        try {
            await this.checkParamEmpty("sqliteFile", sqliteFile);
            await this.checkParamEmpty("tableName", tableName);
            await this.checkFileExists(sqliteFile);
            const config = new SqliteConnectionConfig();
            config.filepath = sqliteFile;
            const connectionFactory = new ConnectionFactory(config, true);
            const connection = await connectionFactory.getConnection();
            const tableInfos = await connection.selectEntities<ColumnInfo>(
                ColumnInfo, `PRAGMA table_info ("${tableName}")`, []);
            return tableInfos;
        } catch (e) {
            return new Promise<ColumnInfo[]>((resolve, reject) => reject(e));
        }
    }

    private async generateTableEntity(sqliteFile: string, tableName: string): Promise<string> {
        try {
            const columInfos = await this.getColumnInfos(sqliteFile, tableName);
            columInfos.forEach((col) => {

            });
        } catch (e) {
            return new Promise<string>((resolve, reject) => reject(e));
        }
    }

    private checkFileExists(sqliteFile: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.exists(sqliteFile, (exists) => {
                if (exists) {
                    resolve();
                } else {
                    reject(new Error(`can not find file: "${sqliteFile}"`));
                }
            });
        });
    }

    private checkParamEmpty(paramName: string, paramValue: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (util.isNullOrUndefined(paramValue)) {
                reject(new Error(`"${paramName}" can not be empty!`));
            } else {
                resolve();
            }
        });
    }
}
