import * as lodash from "lodash";
import { ColumnInfo } from "tsbatis";

export class TemplateHelper {
    public static generateTableEntity(tableName: string, columnInfos: ColumnInfo[]): string {
        const entityNameTemp = lodash.camelCase(tableName);
        const entityName = entityNameTemp.substring(0, 1).toUpperCase() +
            entityNameTemp.substring(1, entityNameTemp.length);
        const properties = TemplateHelper.generateProperties(columnInfos);
        const result =
            `import { column, TableEntity } from "tsbatis";\r\n` +
            `\r\n` +
            `export class ${entityName} extends TableEntity {\r\n` +
            `${properties}\r\n` +
            `    public getTableName(): string {\r\n` +
            `        return "${tableName}";\r\n` +
            `    }\r\n` +
            `}\r\n`;
        return result;
    }

    public static generateProperties(columnInfos: ColumnInfo[]): string {
        let result = "";
        for (const columnInfo of columnInfos) {
            result = result + TemplateHelper.generateProperty(columnInfo);
        }
        return result;
    }

    public static generateProperty(columnInfo: ColumnInfo): string {
        const result =
            `    @column("${columnInfo.columnName}", ${columnInfo.isKey}, ${columnInfo.insertable})\r\n` +
            `    public ${columnInfo.property}: ${columnInfo.propertyType};\r\n`;
        return result;
    }
}
