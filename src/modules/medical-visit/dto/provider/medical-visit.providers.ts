import { Provider } from "@nestjs/common";
import { MedicalVisitEntity } from "src/entities/psql/MedicalVisitEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum MEDICAL_VISIT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'MEDICAL_VISIT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const MEDICAL_VISIT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: MEDICAL_VISIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(MedicalVisitEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];