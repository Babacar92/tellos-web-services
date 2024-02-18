import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * Arg of pagination
 */
@InputType()
export class PaginationArg {
    /**
     * Page of resulte
     */
    @IsOptional()
    @IsInt()
    @Min(1)
    @Field((type) => Int)
    public page = 1;

    /**
     * Limit per page
     */
    @IsOptional()
    @IsInt()
    @Min(0)
    @Field((type) => Int)
    public limit = 10;
}
