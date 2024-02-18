import { PSQL_DB_CONN_NAME } from "@/datasource-config";
import { Inject, Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { DataSource, QueryBuilder } from "typeorm";

@ValidatorConstraint({
    name: 'NotExistByColumnConstraint',
    async: true
})
@Injectable()
export class NotExistByColumnConstraint implements ValidatorConstraintInterface {

    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _translationService: TranslationService
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        let entity = validationArguments.constraints[0]
        let qb = this.dataSource.getRepository(validationArguments.constraints[0]).createQueryBuilder(`tab`);
        qb.select(`COUNT(id) AS total`);

        if (entity.isColumnString(validationArguments.property)) {
            qb.andWhere(`${validationArguments.property} ILIKE :column_value`, {
                column_value: value,
            });
        } else {
            qb.andWhere(`${validationArguments.property} = :column_value`, {
                column_value: value,
            });
        }

        let objectToVerify: any = validationArguments.object;
        if (objectToVerify && objectToVerify.id > 0 && validationArguments.property !== 'id'){
            qb.andWhere(`id != :column_id`, { column_id: objectToVerify.id, });
        }

        const { total } = await qb.getRawOne();
        return !(parseInt(total) > 0);

    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

       const tableName = this.dataSource.getRepository(validationArguments.constraints[0]).metadata.tableMetadataArgs.name;
        return this._translationService.trans(`One or more item with the value '${value}' already exist for the column '${validationArguments.property}' in the entity '${tableName}'`, {
            value: value,
        }, domain).getValue();
    }
}