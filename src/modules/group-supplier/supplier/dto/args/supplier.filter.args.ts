import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SupplierFilterArgs extends DatabaseFilterArg {

    @IsOptional()
    @IsInt()
    public id: number;

    @IsOptional()
    @IsInt({
        each: true,
    })
    public ids: number[]; 

    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsString()
    public vat?: string;

    @IsOptional()
    @IsString()
    public siret?: string;

    @IsOptional()
    @IsString()
    public ape?: string;
    
    @IsOptional()
    @IsString()
    public fax?: string;

    @IsOptional()
    @IsString()
    public phone?: string;

    @IsOptional()
    @IsString()
    public clientName?: string;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;

    @IsOptional()
    @IsString()
    public city?: string;

    @IsOptional()
    @IsString()
    public zipCode?: string;

    @IsOptional()
    @IsInt()
    public category?: number;

    @IsOptional()
    @IsInt({
        each: true
    })
    public categories?: number[];

    @IsOptional()
    @IsInt()
    public languageCode?: number;
    
    @IsOptional()
    @IsInt({
        each: true
    })
    public languageCodes?: number[];


}
