import { IsBoolean, IsInt, IsOptional, IsNumber } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SupplierCommunicationFilterArgs extends DatabaseFilterArg {
    @IsOptional()
    @IsNumber()
    public supplier_id?: number;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
