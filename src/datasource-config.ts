import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const {
    // DEFAULT VARIABLES
    DB_MIGRATION_TABLE_NAME,
    DB_TABLE_PREFIX,
    DB_SYNC,
    DB_LOGGING,

    // PSQL VARIABLES
    PSQL_DB_NAME,
    PSQL_HOST,
    PSQL_PORT,
    PSQL_USER,
    PSQL_SCHEMA,
    PSQL_PASSWORD,
} = process.env;

// List of DataSources
const DataSources: { [key: string]: DataSource } = {};

// PSQL CONNECTION NAME
export const PSQL_DB_CONN_NAME = 'psql';

// PSQL DATASOURCE
DataSources[PSQL_DB_CONN_NAME] = new DataSource({
    type: 'postgres',
    database: PSQL_DB_NAME,
    host: PSQL_HOST,
    port: parseInt(PSQL_PORT),
    schema: PSQL_SCHEMA,
    username: PSQL_USER,
    password: PSQL_PASSWORD,
    entityPrefix: DB_TABLE_PREFIX,
    migrationsTableName: DB_MIGRATION_TABLE_NAME,
    migrationsTransactionMode: 'none',
    synchronize: DB_SYNC === 'true',
    logging: DB_LOGGING === 'true',
    namingStrategy: new SnakeNamingStrategy(),
    entities: [`dist/src/entities/${PSQL_DB_CONN_NAME}/*{.js,.ts}`],
    migrations: [`dist/src/migrations/${PSQL_DB_CONN_NAME}/*{.js,.ts}`],
    subscribers: [`dist/src/subscribers/${PSQL_DB_CONN_NAME}/*{.js,.ts}`],
});

// Export default all Connections
export default DataSources;
