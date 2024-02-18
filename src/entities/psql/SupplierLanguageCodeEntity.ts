//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

//BaseEntity
import { BaseEntity } from '@/common/entities/base.entity';

//Enums

//Class Validator
import { IsString, IsBoolean } from 'class-validator';

@Unique(['code', 'deletedAt'])
@ObjectType('SupplierLanguageCodeEntity')
@Entity({
    name: 'supplier_language_code',
})
export class SupplierLanguageCodeEntity extends BaseEntity {

    public constructor(data?: Partial<SupplierLanguageCodeEntity>) {
        super();
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    @IsString()
    code: string;

    @Column()
    @Field()
    @IsString()
    name: string;

    @Column({
        type: 'boolean',
        default: true,
    })
    @Field({ nullable: true })
    @IsBoolean()
    public active?: boolean;

    public static init(id?: number): Partial<SupplierLanguageCodeEntity> {
        return id ? new SupplierLanguageCodeEntity({ id: id }) : null;
    }

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(code|name|createdBy|updatedBy)$/i);
    }
}
