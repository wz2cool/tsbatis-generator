import * as fs from "fs";
import * as lodash from "lodash";
import * as path from "path";
import { ConnectionFactory, SqliteConnectionConfig } from "tsbatis";
import { TableInfo, TableName } from "../db/entity/view";

export class SqliteService {
    public async getTableNames(sqliteFile: string): Promise<string[]> {
        try {
            await this.checkFileExists(sqliteFile);
            const config = new SqliteConnectionConfig();
            config.filepath = sqliteFile;
            const connectionFactory = new ConnectionFactory(config, true);
            const connection = await connectionFactory.getConnection();
            const tableNames = await connection.selectEntities<TableName>(
                TableName, "SELECT name FROM sqlite_master WHERE type='table'", []);
            const result = lodash.map(tableNames, (x) => x.name);
            return result;
        } catch (e) {
            return new Promise<string[]>((resolve, reject) => reject(e));
        }
    }

    public async getTableInfos(sqliteFile: string, tableName: string): Promise<TableInfo[]> {
        try {
            await this.checkFileExists(sqliteFile);
            const config = new SqliteConnectionConfig();
            config.filepath = sqliteFile;
            const connectionFactory = new ConnectionFactory(config, true);
            const connection = await connectionFactory.getConnection();
            const tableInfos = await connection.selectEntities<TableInfo>(
                TableInfo, `PRAGMA table_info ("${tableName}");`, []);
            return tableInfos;
        } catch (e) {
            return new Promise<TableInfo[]>((resolve, reject) => reject(e));
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
}
