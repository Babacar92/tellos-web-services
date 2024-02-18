import DataSources from "./src/datasource-config";

const {
    DATASOURCE_TARGET,
} = process.env;

if(!DataSources[DATASOURCE_TARGET]) {
    throw new Error(`No Target DataSource ${DATASOURCE_TARGET} in Env "DATASOURCE_TARGET"`);
}

export = [DataSources[DATASOURCE_TARGET]];