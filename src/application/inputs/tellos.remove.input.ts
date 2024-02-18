import { IsEnum, IsNumber } from 'class-validator';
import { Field, Int, InputType } from '@nestjs/graphql';
import { REMOVE_TYPES } from '@Libs/databases/dto/types/databases.type';

@InputType('TellosRemoveInput')
export class TellosRemoveInput {
    @Field(() => Int)
    @IsNumber()
    public id!: number;

    @Field(() => REMOVE_TYPES, {
        nullable: true,
        defaultValue: REMOVE_TYPES.SOFT,
    })
    @IsEnum(REMOVE_TYPES)
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
