import {
    IsBoolean,
    IsDate,
    IsNumber,
    IsOptional,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { WorkUnitEntity } from 'src/entities/psql/WorkUnitEntity';
import { WorkUnitExistConstraint } from 'src/modules/work-unit/constraints/work-unit.exist.constraint';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { Good } from '@Entities/good.entity';
import { GoodExistConstraint } from 'src/modules/good/constraints/good.exist.constraint';
import { Supplier } from '@/entities/psql/supplier.entity';
/**
 * Input for to create a new goodReferencePrice
 */
export class GoodReferencePriceCreateArgInput {
    /**
     * The start date of the appication of the good reference price
     */
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    /**
     * The end date of the application of the good reference price
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    @IsOptional()
    @Transform(({ value }) => Supplier.init(value))
    public supplier?: Supplier;

    /**
     * The initial price
     */
    @IsNumber()
    public price?: number;

    /**
     * The discount price
     */
    @IsOptional()
    @IsNumber()
    public discount?: number;

    /**
     * The price after discount
     */
    @IsOptional()
    @IsNumber()
    @Transform(({ value, obj }) => {
        // Calcul automaticaly the netPrice if not given (based on price and discount)
        if (value == null && obj.price) {
            return obj.discount != null ? obj.price - obj.discount : obj.price;
        }
        return value;
    })
    public netPrice?: number;

    /**
     * The minimum quantity for which the price can be applied
     */
    @IsOptional()
    @IsNumber()
    public qtyMin?: number;

    /**
     * The good reference price is in an executive contract (Contrat Cadre)
     */
    @IsOptional()
    @IsBoolean()
    public executiveContract?: boolean;

    /**
     * The work unit link to the good reference price
     */
    @Validate(WorkUnitExistConstraint)
    @Transform(({ value }) => WorkUnitEntity.init(value))
    public workUnit?: WorkUnitEntity;

    /**
     * The good link to the good reference price
     */
    @Validate(GoodExistConstraint)
    @Transform(({ value }) => Good.init(value))
    public good?: Good;

    /**
     * The entities for which the good reference price will be applied
     */
    @Validate(EntityExistConstraint, {
        each: true,
    })
    @Transform(({ value }) => value.map((item) => EntityEntity.init(item)))
    public entities?: EntityEntity[];

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active = true;
}
