import { Field, InputType, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
@InputType()
export class SupplierNoteFilterArgs extends DatabaseFilterArg {
    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    @Expose({ name: 'supplier' })
    public supplierId?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    public loginId?: number;
}
