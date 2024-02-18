
import { DataSource } from "typeorm";
import DataSources from "../../../datasource-config";
import { dump } from "../../../utils/utils";
import { isConsoleExecution } from "src/utils/console.utils";

export const databasesProviders: { provide: string, useFactory: () => Promise<DataSource> }[] = (() => {
    const data: { provide: string, useFactory: () => Promise<DataSource> }[] = [];

    for (let name in DataSources) {
        const DataSourceConfig = DataSources[name];

        if (!(DataSourceConfig instanceof DataSource)) {
            throw new Error(`The database ${name} is not an instance if DataSource`);
        }

        if (!(DataSourceConfig.options.subscribers instanceof Array)) {
            throw new Error(`The DataSource ${name} must have a list of subscribers`);
        }

        DataSourceConfig.options.subscribers.push(`${__dirname}/../subscribers/*{.js,.ts}`);

        if (isConsoleExecution()) {
            const NoLoggedDataSourceConfig = new DataSource({
                ...DataSourceConfig.options,
                logging: false,
            });

            data.push({
                provide: name,
                useFactory: () => NoLoggedDataSourceConfig.initialize(),
            });
        } else {
            data.push({
                provide: name,
                useFactory: () => DataSourceConfig.initialize(),
            });
        }
    }

    return data;
})();