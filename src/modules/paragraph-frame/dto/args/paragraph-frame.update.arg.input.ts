import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ParagraphFrameExistConstraint } from "../../constraints/paragraph-frame.exist.constraint";
import { ParagraphFrameNotExistByColumnConstraint } from "../../constraints/paragraph-frame.not.exist.by.column.constraints";
import { PermissionExistConstraint } from "src/modules/permission/constraints/permission.exist.constraint";
import { PermissionEntity } from "src/entities/psql/PermissionEntity";
import { ParagraphFrameEntity } from "src/entities/psql/ParagraphFrameEntity";
import { CONTRACT_CATEGORY_ENUM } from "src/modules/contract/dto/enums/contract.category.enum";

/**
 * Input for to update a new Quick Access
 */
export class ParagraphFrameUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(ParagraphFrameExistConstraint, {

    })
    @Transform(({ value }) => ParagraphFrameEntity.init(value))
    public id: number;

    /**
     * The title of paragraph frame
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The content of paragraph frame
     */
    @IsOptional()
    @IsString()
    public content?: string;

    /**
     * The content of paragraph frame
     */
    @IsOptional()
    @IsEnum(CONTRACT_CATEGORY_ENUM)
    public category?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}