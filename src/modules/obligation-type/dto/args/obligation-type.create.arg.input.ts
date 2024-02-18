import { IsString, Validate } from 'class-validator';
import { ObligationTypeNotExistByColumnConstraint } from '../../constraints/equipment-funding.not.exist.by.column.constraints';

/**
 * Input for to create a new equipment funding
 */
export class ObligationTypeCreateArgInput {
    /**
     * The name of equipment funding
     */
    @IsString()
    @Validate(ObligationTypeNotExistByColumnConstraint, {})
    public name: string;
}
