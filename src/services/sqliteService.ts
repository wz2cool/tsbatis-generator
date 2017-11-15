import * as fs from "fs";
import * as lodash from "lodash";
import * as path from "path";
import { ConnectionFactory, SqliteConnectionConfig } from "tsbatis";
import { TableName, TableInfo } from "../db/entity/view";

export class SqliteService {
    public static async getTableNames(sqliteFile: string): Promise<string[]> {
        if (!fs.existsSync(sqliteFile)) {
            return new Promise<string[]>((resolve, reject) => {
                reject(new Error(`can not find file: "${sqliteFile}"`));
            });
        }

        try {
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

    public static async getTableInfo(sqliteFile: string, tableName: string): Promise<TableInfo[]> {
        if (!fs.existsSync(sqliteFile)) {
            return new Promise<TableInfo[]>((resolve, reject) => {
                reject(new Error(`can not find file: "${sqliteFile}"`));
            });
        }

        try {
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
}
