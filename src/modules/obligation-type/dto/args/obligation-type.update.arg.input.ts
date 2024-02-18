import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { ObligationTypeNotExistByColumnConstraint } from '../../constraints/equipment-funding.not.exist.by.column.constraints';
import { ObligationTypeExistConstraint } from '../../constraints/obligation-type.exist.constraint';

/**
 * Input for to update a new equipment funding
 */
export class ObligationTypeUpdateArgInput {
    /**
     * The id of equipment funding
     */
    @IsNotEmpty()
    @Validate(ObligationTypeExistConstraint, {})
    public id: number;

    /**
     * The title of equipment funding
     */
    @IsOptional()
    @IsString()
    @Validate(ObligationTypeNotExistByColumnConstraint, {})
    public name?: string;
}
