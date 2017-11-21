import * as lodash from "lodash";
import {
    column,
    ColumnInfo,
    ConnectionFactory,
    DynamicQuery,
    FilterCondition,
    FilterDescriptor,
    FilterOperator,
    MysqlConnectionConfig,
} from "tsbatis";
import * as util from "util";
import { MysqlTableInfo } from "../db/entity/table";
import { MysqlTableInfoMapper } from "../db/mapper";

export class MysqlService {
    public async getTableNames(uri: string, user: string, pwd: string, database: string): Promise<string[]> {
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
            config.port = Number.parseInt(port);
            config.user = user;
            config.password = pwd;
            config.database = database;

            const connectionFactory = new ConnectionFactory(config, true);
            const connection = await connectionFactory.getConnection();
            const mysqlTableInfoMapper = new MysqlTableInfoMapper(connection);
            const dbFilter = new FilterDescriptor<MysqlTableInfo>((u) => u.tableSchema, FilterOperator.EQUAL, database);
            const query = DynamicQuery.createIntance<MysqlTableInfo>().addFilters(dbFilter);
            const mysqlTableInfos = await mysqlTableInfoMapper.selectByDynamicQuery(query);
            const result = lodash.uniq(lodash.map(mysqlTableInfos, (x) => x.tableName));
            return result;
        } catch (e) {
            return new Promise<string[]>((resolve, reject) => reject(e));
        }
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
