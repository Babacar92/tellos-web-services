import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, Validate } from "class-validator";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";
import { CustomerTimelineTypeEnum } from "../enum/customer-timeline.type.enum";
import { CustomerTimelineCheckStartAndEndDateConstraint } from "../../constraints/customer-timeline.check.start.and.end.date.constraint";
import { LoginEntity } from "../../../../entities/psql/LoginEntity";

/**
 * Input for to create a new Quick Access
 */
export class CustomerTimelineCreateArgInput {

    /**
     * The connected user
     */
    public login?: LoginEntity;

    /**
     * Customer of note
     */
    @Transform(({ value }) => CustomerEntity.init(value))
    @Validate(CustomerExistConstraint, {

    })
    public customer: CustomerEntity;

    /**
     * Title
     */
    @IsString()
    public title: string;

    /**
     * Title
     */
    @IsEnum(CustomerTimelineTypeEnum)
    public type: CustomerTimelineTypeEnum;

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
    })
    public file?: GraphqlFileUpload;

    /**
     * Title
     */
    @IsOptional()
    @IsString()
    public comment?: string;

    /**
     * Date from
     */
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateFrom: Date;

    /**
     * Date to
     */
    @IsOptional()
    @Validate(CustomerTimelineCheckStartAndEndDateConstraint, {

    })
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateTo?: Date;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public isTodo?: boolean;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}