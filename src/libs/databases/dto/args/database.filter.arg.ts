import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

/**
 * Default sort from database
 */
export class DatabaseFilterArg {
    /**
     * Id of Items
     */
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    public id?: number;

    /**
     * Id of Items
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    @Transform(({ value }) => {
        if (value instanceof Array) {
            return value.map((v) => parseInt(v));
        }
    })
    public ids?: number[];

    /**
     * Search of column
     */
    @IsOptional()
    @IsString()
    public search?: string;
}
