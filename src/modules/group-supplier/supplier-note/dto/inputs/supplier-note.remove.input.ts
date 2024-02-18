import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Validate } from 'class-validator';
import { SupplierNoteEntity } from '@/entities/psql/supplier-note.entity';
import { RemoveTypeItemValidate } from '../../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../../libs/databases/dto/types/databases.type';
import { SupplierNoteExistConstraint } from '../../constraints/supplier-note.exist.constraint';
import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Input for to create a new Quick Access
 */
@InputType()
export class SupplierNoteRemoveInput {
    /**
     * Id of upload file
     */
    @Validate(SupplierNoteExistConstraint, {})
    @IsNumber()
    @Field((type) => Int)
    public id!: number;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    @Field((type) => String)
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
