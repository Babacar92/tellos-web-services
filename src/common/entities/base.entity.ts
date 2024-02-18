import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Field } from '@nestjs/graphql';

export class BaseEntity {
    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => Date)
    @DeleteDateColumn()
    deletedAt: Date;

    @Field()
    @CreatedByColumn()
    public createdBy: string;

    @Field()
    @UpdatedByColumn()
    public updatedBy: string;
}
