import * as express from "express";
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
                    res.json({ results: names });
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        sqliteApi.post("/getTableInfos", (req, res, next) => {
            const sqliteFile = req.body.sqliteFile;
            const tableName = req.body.tableName;
            this.sqliteService.getTableInfos(sqliteFile, tableName)
                .then((infos) => {
                    res.json({ results: infos });
                })
                .catch((e) => {
                    res.status(500);
                    res.json({ error: e.message });
                });
        });

        return sqliteApi;
    }
}
