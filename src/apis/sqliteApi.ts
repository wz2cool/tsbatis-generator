import * as express from "express";
import * as path from "path";
import { SqliteService } from "../services/sqliteService";

export class SqliteApi {
    private readonly sqliteService = new SqliteService();
    public getRoute(): express.Router {
        const sqliteApi = express.Router();

        sqliteApi.get("/", (req, res, next) => {
            res.json({ results: "SqliteApi" });
        });

        sqliteApi.post("/getTableNames", (req, res, next) => {
            const sqliteFile = req.body.sqliteFile;
            console.log(JSON.stringify(req.body));
            this.sqliteService.getTableNames(sqliteFile)
                .then((names) => {
                    res.json(names);
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        sqliteApi.post("/getColumnInfos", (req, res, next) => {
            const sqliteFile = req.body.sqliteFile;
            const tableName = req.body.tableName;
            this.sqliteService.getDbColumnInfos(sqliteFile, tableName)
                .then((infos) => {
                    res.json({ results: infos });
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        sqliteApi.post("/generateEntities", (req, res, next) => {
            const sqliteFile = req.body.sqliteFile;
            const tableNames = req.body.tableNames;
            this.sqliteService.generateTableEntitiesZipFile(sqliteFile, tableNames)
                .then((zipFile) => {
                    res.download(zipFile, path.basename(zipFile));
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        return sqliteApi;
    }
}
