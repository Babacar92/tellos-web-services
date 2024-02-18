import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { CustomerTypeEnum } from "../enum/customer-type.enum";
import { CustomerTypologyEnum } from "../enum/customer-typology.enum";

/**
 * Input for to filter a new Quick Access
 */
export class CustomerFilterArgInput extends DatabaseFilterArg {

    /**
     * The statuses filter
     */
    @IsOptional()
    @IsBoolean({
        each: true,
    })
    public statuses?: boolean[];

    /**
     * The families filter
     */
    @IsOptional()
    @IsEnum(CustomerTypeEnum, {
        each: true,
    })
    public families?: CustomerTypeEnum[];

    /**
     * The typologies filter
     */
    @IsOptional()
    @IsEnum(CustomerTypologyEnum, {
        each: true,
    })
    public typologies?: CustomerTypologyEnum[];

    /**
     * The code filter
     */
    @IsOptional()
    @IsString()
    public code?: string;

    /**
     * The name filter
     */
    @IsOptional()
    @IsString()
    public name?: string;

    /**
     * The address filter
     */
    @IsOptional()
    @IsString()
    public address?: string;

    /**
     * The phone filter
     */
    @IsOptional()
    @IsString()
    public phone?: string;

}