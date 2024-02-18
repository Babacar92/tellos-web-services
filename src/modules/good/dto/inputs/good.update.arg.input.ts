import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
    IsEnum,
    IsNumber,
} from 'class-validator';
import { GoodNotExistByColumnConstraint } from '../../constraints/good.not.exist.by.column.constraints';
import { GoodExistConstraint } from '../../constraints/good.exist.constraint';
import { GOOD_STATUS } from '../../enums/good-status.enum';
import { WorkUnitEntity } from 'src/entities/psql/WorkUnitEntity';
import { Expose, Transform } from 'class-transformer';
import { SectionCodeEntity } from 'src/entities/psql/SectionCodeEntity';
import { ArticleFamilyEntity } from 'src/entities/psql/ArticleFamilyEntity';
import { Supplier } from '@/entities/psql/supplier.entity';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';

/**
 * Input for to update a new Good
 */
export class GoodUpdateArgInput {
    /**
     * The id of Good
     */
    @IsNotEmpty()
    @Validate(GoodExistConstraint, {})
    public id: number;

    /**
     * The name of Good
     */
    @IsString()
    @Validate(GoodNotExistByColumnConstraint, {})
    public name?: string;

    /**
     * The second name of Good
     */
    @IsString()
    @Validate(GoodNotExistByColumnConstraint, {})
    public nameBis?: string;

    /**
     * Is for shop?
     */
    @IsOptional()
    @IsBoolean()
    public shopGood?: boolean;

    /**
     * The good status
     */
    @IsOptional()
    @IsEnum(GOOD_STATUS)
    public status?: GOOD_STATUS;

    /**
     * The ean code of good
     */
    @IsOptional()
    @IsString()
    public ean?: string;

    /**
     * The length of good
     */
    @IsOptional()
    @IsNumber()
    public lengthSize?: number;

    /**
     * The width of good
     */
    @IsOptional()
    @IsNumber()
    public widthSize?: number;

    /**
     * The height of good
     */
    @IsOptional()
    @IsNumber()
    public heightSize?: number;

    /**
     * The volume of good
     */
    @IsOptional()
    @IsNumber()
    public volume?: number;

    /**
     * The gross weight of good
     */
    @IsOptional()
    @IsNumber()
    public grossWeight?: number;

    /**
     * The net weight of good
     */
    @IsOptional()
    @IsNumber()
    public netWeight?: number;

    /**
     * The technical description of good
     */
    @IsOptional()
    @IsString()
    public technicalDescription?: string;

    /**
     * The good is available for selection
     */
    @IsOptional()
    @IsBoolean()
    public selectionActive?: boolean;

    /**
     * The good is available for stock management
     */
    @IsOptional()
    @IsBoolean()
    public stockManagement?: boolean;

    /**
     * Is the article generic?
     */
    @IsOptional()
    @IsBoolean()
    public isGeneric?: boolean;

    /**
     * The work unit link to the good
     */
    @Validate(ExistByIdConstraint, [WorkUnitEntity])
    @Transform(({ value }) => WorkUnitEntity.init(value))
    public workUnit?: WorkUnitEntity;

    //Supplier
    @Validate(ExistByIdConstraint, [Supplier])
    @Transform(({ value }) => Supplier.init(value))
    @Expose({ name: 'supplier' })
    public supplier?: Supplier;

    /**
     * The section code link to the good
     */
    @Validate(ExistByIdConstraint, [SectionCodeEntity])
    @Transform(({ value }) => SectionCodeEntity.init(value))
    public sectionCode?: SectionCodeEntity;

    /**
     * The article family link to the good
     */
    @Validate(ExistByIdConstraint, [ArticleFamilyEntity])
    @Transform(({ value }) => ArticleFamilyEntity.init(value))
    public parentFamily?: ArticleFamilyEntity;

    /**
     * The article subfamily link to the good
     */
    @Validate(ExistByIdConstraint, [ArticleFamilyEntity])
    @Transform(({ value }) => ArticleFamilyEntity.init(value))
    public subFamily?: ArticleFamilyEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active = true;
}
