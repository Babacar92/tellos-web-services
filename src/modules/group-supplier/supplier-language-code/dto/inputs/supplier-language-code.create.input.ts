import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('SupplierLanguageCodeCreateInput')
export class SupplierLanguageCodeCreateInput {
    @IsString()
    @Field()
    code?: string;

    @IsString()
    @Field()
    name?: string;
}
