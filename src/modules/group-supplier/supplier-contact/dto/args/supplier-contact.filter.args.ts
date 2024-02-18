import { IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SupplierContactFilterArgs extends DatabaseFilterArg {
    @IsOptional()
    @IsNumber()
    public supplier?: number;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
