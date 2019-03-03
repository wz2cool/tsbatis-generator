// https://www.service-architecture.com/articles/database/mapping_sql_and_java_data_types.html
// https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-type-conversions.html
export class MySqlType {
  private constructor() {}
  // number type.
  public static readonly BIT = "BIT";
  public static readonly TINYINT = "TINYINT";
  public static readonly BOOL = "BOOL";
  public static readonly BOOLEAN = "BOOLEAN";
  public static readonly SMALLINT = "SMALLINT";
  public static readonly MEDIUMINT = "MEDIUMINT";
  public static readonly INT = "INT";
  public static readonly INTEGER = "INTEGER";
  public static readonly BIGINT = "BIGINT";
  public static readonly FLOAT = "FLOAT";
  public static readonly DOUBLE = "DOUBLE";
  public static readonly DECIMAL = "DECIMAL";
  public static readonly DATE = "DATE";
  public static readonly DATETIME = "DATETIME";
  public static readonly TIMESTAMP = "TIMESTAMP";
  public static readonly TIME = "TIME";
  public static readonly YEAR = "YEAR";
  public static readonly CHAR = "CHAR";
  public static readonly VARCHAR = "VARCHAR";
  public static readonly BINARY = "BINARY";
  public static readonly VARBINARY = "VARBINARY";
  public static readonly TINYBLOB = "TINYBLOB";
  public static readonly TINYTEXT = "TINYTEXT";
  public static readonly BLOB = "BLOB";
  public static readonly TEXT = "TEXT";
  public static readonly MEDIUMBLOB = "MEDIUMBLOB";
  public static readonly MEDIUMTEXT = "MEDIUMTEXT";
  public static readonly LONGBLOB = "LONGBLOB";
  public static readonly LONGTEXT = "LONGTEXT";
}
