import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { EntityType } from "../enum/entity.type.enum";

/**
 * Input for to filter a new Quick Access
 */
export class EntityFilterArgInput extends DatabaseFilterArg {

    /**
     * Has organigramme
     */
    public hasInformation?: boolean;

    /**
     * Has organigramme
     */
    public hasOrganigramme?: boolean;

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public labels?: string[];

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public colorGradiantLeft?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public colorsGradiantLeft?: string[];

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public colorGradiantRight?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public colorsGradiantRight?: string[];

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public colorHeader?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public colorsHeader?: string[];

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public colorSticker?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public colorsSticker?: string[];

    /**
     * Exclude one ID
     */
    @IsOptional()
    @IsInt()
    public withoutId?: number;

    /**
     * Exclude multiple IDs
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public withoutIds?: number[];

    /**
     * The target employees for filter
     */
    @IsOptional()
    @IsInt()
    public totalEmployees?: number;

    /**
     * The target description for filter
     */
    @IsOptional()
    @IsString()
    public description?: string;

    /**
     * The type
     */
    @IsOptional()
    @IsEnum(EntityType, {

    })
    public type?: EntityType;

    /**
     * The type
     */
    @IsOptional()
    @IsEnum(EntityType, {
        each: true,
    })
    public types?: EntityType[];

    /**
     * The target active for filter
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}