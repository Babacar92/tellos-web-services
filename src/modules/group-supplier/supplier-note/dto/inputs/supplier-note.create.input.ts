import {
    IsArray,
    IsBoolean,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { Supplier } from '@/entities/psql/supplier.entity';
// import { SupplierExistConstraint } from "src/modules/supplier/constraints/supplier.exist.constraint";
import { LoginEntity } from 'src/entities/psql/LoginEntity';
import { GraphqlFilesUploadMultipleValidate } from 'src/libs/upload/decorators/validators/GraphqlFilesUploadMultipleValidate';
import { Field, InputType, Int } from '@nestjs/graphql';
import { LoginExistConstraint } from '@/modules/login/constraints/login.exist.constraint';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { Expose, Transform } from 'class-transformer';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';

@InputType()
export class SupplierNoteCreateInput {
    @IsOptional()
    @IsString()
    @Field()
    public comment!: string;

    @IsOptional()
    @Validate(LoginExistConstraint, {})
    @Transform(({ value }) => LoginEntity.init(value))
    @Field((type) => Int)
    public login?: LoginEntity;

    @Validate(ExistByIdConstraint, [Supplier])
    @Field((type) => Int)
    @Transform(({ value }) => Supplier.init(value))
    @Expose({ name: 'supplier' })
    public supplierId: Supplier;

    @IsOptional()
    @IsArray()
    @GraphqlFilesUploadMultipleValidate({})
    public documents?: GraphqlFileUpload[];

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
