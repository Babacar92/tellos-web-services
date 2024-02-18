import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CONTRACT_CATEGORY_ENUM } from "src/modules/contract/dto/enums/contract.category.enum";

/**
 * Input for to create a new Quick Access
 */
export class ParagraphFrameCreateArgInput {

    /**
     * The title of paragraph frame
     */
    @IsNotEmpty()
    @IsString()
    public title?: string;

    /**
     * The content of paragraph frame
     */
    @IsNotEmpty()
    @IsString()
    public content?: string;

    /**
     * The content of paragraph frame
     */
    @IsNotEmpty()
    @IsEnum(CONTRACT_CATEGORY_ENUM)
    public category?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}