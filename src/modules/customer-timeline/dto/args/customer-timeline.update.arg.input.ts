import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { CustomerTimelineExistConstraint } from "../../constraints/customer-timeline.exist.constraint";
import { Transform } from "class-transformer";
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { CustomerTimelineTypeEnum } from "../enum/customer-timeline.type.enum";
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";
import { CustomerTimelineCheckStartAndEndDateConstraint } from "../../constraints/customer-timeline.check.start.and.end.date.constraint";
import { LoginEntity } from "../../../../entities/psql/LoginEntity";

/**
 * Input for to update a new Quick Access
 */
export class CustomerTimelineUpdateArgInput {

    /**
     * The connected user
     */
    public login?: LoginEntity;

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(CustomerTimelineExistConstraint, {

    })
    public id: number;

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
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * Title
     */
    @IsOptional()
    @IsEnum(CustomerTimelineTypeEnum)
    public type?: CustomerTimelineTypeEnum;

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
    @IsOptional()
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
    @IsDate()
    @Validate(CustomerTimelineCheckStartAndEndDateConstraint, {

    })
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
     * Is done
     */
    @IsOptional()
    @IsBoolean()
    public done?: boolean;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}