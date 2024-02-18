import { PSQL_DB_CONN_NAME } from "@/datasource-config";
import { Inject, Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { DataSource, QueryBuilder } from "typeorm";

@ValidatorConstraint({
    name: 'ExistConstraint',
    async: true
})
@Injectable()
export class ExistByIdConstraint implements ValidatorConstraintInterface {

    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _translationService: TranslationService
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        console.log("value", value);
        let qb = this.dataSource.getRepository(validationArguments.constraints[0]).createQueryBuilder(`tab`);
        qb.select(`COUNT(id) AS total`);
        qb.andWhere(`tab.id = :column_value`, { column_value: value.id? value.id : value });
        const { total } = await qb.getRawOne();
        return (parseInt(total) > 0);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;
        const domain = 'validation';
        const tableName = this.dataSource.getRepository(validationArguments.constraints[0]).metadata.tableMetadataArgs.name;
        return this._translationService.trans(`The item with the value '${value.id? value.id : value}' for the column 'id' in the entity '${tableName}' doesn't exist`, {
            value: value,
        }, domain).getValue();
    }
}