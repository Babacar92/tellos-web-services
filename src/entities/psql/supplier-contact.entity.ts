//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import {
    Column,
    Unique,
    JoinColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

//BaseEntity
import { BaseEntity } from '@/common/entities/base.entity';

//Entities
import { Supplier } from '@Entities/supplier.entity';

//Contact
@ObjectType('SupplierContact')
@Unique(['mobilePhone', 'deletedAt'])
@Unique(['email', 'deletedAt'])
@Entity({ name: 'supplier_contact' })
export class SupplierContact extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @ManyToOne(() => Supplier, (supplier) => supplier.id)
    @JoinColumn({ name: 'supplier_id' })
    @Field(() => Supplier)
    supplier: Supplier;

    @Column({ name: 'supplier_id' })
    supplier_id: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    name?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    service?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    phone?: string;

    @Column({ nullable: true, name: 'mobile_phone' })
    @Field(() => String, { nullable: true })
    mobilePhone?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    email?: string;

    @Field({ nullable: true })
    @Column({
        type: 'boolean',
        default: true,
    })
    active?: boolean;

    public static isColumnString(value: string): boolean {
        return !!value.match(/^(name|service|phone|mobilePhone|email|createdBy|updatedBy)$/i);
    }
}
