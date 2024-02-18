import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { SupplierNoteExistConstraint } from '../../constraints/supplier-note.exist.constraint';
import { Expose, Transform } from 'class-transformer';
import { Supplier } from '@/entities/psql/supplier.entity';
// import { SupplierExistConstraint } from "src/modules/group-supplier/supplier/constraints/supplier.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { GraphqlFilesUploadMultipleValidate } from 'src/libs/upload/decorators/validators/GraphqlFilesUploadMultipleValidate';
import { LoginEntity } from 'src/entities/psql/LoginEntity';
import { Field, InputType, Int } from '@nestjs/graphql';
import { LoginExistConstraint } from '@/modules/login/constraints/login.exist.constraint';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
import { SupplierNoteEntity } from '@/entities/psql/supplier-note.entity';

/**
 * Input for to update a new Quick Access
 */
@InputType()
export class SupplierNoteUpdateInput {
    @IsNotEmpty()
    @IsNumber()
    @Field((type) => Int)
    @Validate(ExistByIdConstraint, [SupplierNoteEntity])
    public id!: number;

    @IsOptional()
    @IsString()
    @Field()
    public comment!: string;

    @IsOptional()
    @Validate(LoginExistConstraint, {})
    @Field((type) => Int)
    public login?: number;

    @Validate(ExistByIdConstraint, [Supplier])
    @Field((type) => Int)
    @Transform(({ value }) => Supplier.init(value))
    @Expose({ name: 'supplier' })
    public supplierId: number;

    @IsOptional()
    @IsArray()
    @GraphqlFilesUploadMultipleValidate({})
    public documents?: GraphqlFileUpload[];

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
