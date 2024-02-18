import { IsBoolean, IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { CustomerNotExistByColumnConstraint } from "../../constraints/customer.not.exist.by.column.constraints";
import { CustomerTypeEnum } from "../enum/customer-type.enum";
import { CustomerTypologyEnum } from "../enum/customer-typology.enum";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { GraphqlFileUploadValidate } from "src/libs/upload/decorators/validators/GraphqlFileUploadValidate";
import { CustomerCurrencyEnum } from "../enum/customer-currency.enum";
import { CustomerLanguageEnum } from "../enum/customer-language.enum";
import { CustomerPaymentEnum } from "../enum/customer-payment.enum";
import { CustomerTaxEnum } from "../enum/customer-tax.enum";
import { RegulationCodeExistConstraint } from "../../../regulation-code/constraints/regulation-code.exist.constraint";
import { Transform } from "class-transformer";
import { RegulationCodeEntity } from "../../../../entities/psql/RegulationCodeEntity";

/**
 * Input for to create a new Quick Access
 */
export class CustomerCreateArgInput {

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: [
            'jpg', 'png', 'jpeg', 'jfif'
        ],
    })
    public picture?: GraphqlFileUpload;

    /**
     * The name of Customer
     */
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public name: string;

    /**
     * The email of Customer
     */
    @IsEmail()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public email: string;

    /**
     * The code of Customer
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public code?: string;

    /**
     * The address of Customer
     */
    @IsOptional()
    @IsString()
    public address?: string;

    /**
     * The addressBis of Customer
     */
    @IsOptional()
    @IsString()
    public addressBis?: string;

    /**
     * The zipCode of Customer
     */
    @IsOptional()
    @IsString()
    public zipCode?: string;

    /**
     * The city of Customer
     */
    @IsOptional()
    @IsString()
    public city?: string;

    /**
     * The country of Customer
     */
    @IsOptional()
    @IsString()
    public country?: string;

    /**
     * The familly of Customer
     */
    @IsOptional()
    @IsEnum(CustomerTypeEnum, {

    })
    public familly?: CustomerTypeEnum;

    /**
     * The typology of Customer
     */
    @IsOptional()
    @IsEnum(CustomerTypologyEnum, {

    })
    public typology?: CustomerTypologyEnum;

    /**
     * The language of Customer
     */
    @IsOptional()
    @IsEnum(CustomerLanguageEnum, {

    })
    public language?: CustomerLanguageEnum;

    /**
     * The phone of Customer
     */
    @IsOptional()
    @IsString()
    public phone?: string;

    /**
     * The fax of Customer
     */
    @IsOptional()
    @IsString()
    public fax?: string;

    /**
     * The siret of Customer
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public siret?: string;

    /**
     * The ape of Customer
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public ape?: string;

    /**
     * The tvaNumber of Customer
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public tvaNumber?: string;

    /**
     * The taxeCode of Customer
     */
    @IsOptional()
    @IsEnum(CustomerTaxEnum, {

    })
    public taxeCode?: CustomerTaxEnum;

    /**
     * The regulationCode of Customer
     */
    @IsOptional()
    @Validate(RegulationCodeExistConstraint, {

    })
    @Transform(({ value }) => RegulationCodeEntity.init(value))
    public regulationCode?: RegulationCodeEntity;

    /**
     * The currency of Customer
     */
    @IsOptional()
    @IsEnum(CustomerCurrencyEnum, {

    })
    public currency?: CustomerCurrencyEnum;

    /**
     * The rib of Customer
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public rib?: string;

    /**
     * The domiciliation of Customer
     */
    @IsOptional()
    @IsString()
    public domiciliation?: string;

    /**
     * The iban of Customer
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public iban?: string;

    /**
     * The bic of Customer
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public bic?: string;

    /**
     * The invoiceCopyNumber of Customer
     */
    @IsOptional()
    @IsInt()
    public invoiceCopyNumber?: number;

    /**
     * The discountRate of Customer
     */
    @IsOptional()
    @IsNumber()
    public discountRate?: number;

    /**
     * The invoiceEmail of Customer
     */
    @IsOptional()
    @IsEmail()
    @Validate(CustomerNotExistByColumnConstraint, {

    })
    public invoiceEmail?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}