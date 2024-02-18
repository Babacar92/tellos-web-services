import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    Unique,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Field, Int, Float, ObjectType } from '@nestjs/graphql';

//BaseEntity
import { BaseEntity } from '@/common/entities/base.entity';

//Entities
import { Supplier } from './supplier.entity';
import { LoginEntity } from './LoginEntity';
//Enums
import { SupplierCurrencyEnum } from '@ModuleSupplier/enums/supplier.currency.enum';
import { SupplierConditionEnum } from '@ModuleSupplier/enums/supplier.conditions.enum';
import { SupplierDeliveryModeEnum } from '@ModuleSupplier/enums/supplier.delivery-mode.enum';

@ObjectType('SupplierBilling')
@Entity({ name: 'supplier_billing' })
export class SupplierBilling extends BaseEntity {
    public constructor(data?: Partial<SupplierBilling>) {
        super();
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @ManyToOne(() => Supplier, {
        onDelete: 'SET NULL',
    })
    @Field(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ name: 'supplier_id' })
    supplier_id: number;

    @Column({ name: 'tax_code', type: 'bigint', nullable: true })
    @Field(() => String, { nullable: true })
    taxCode?: string;

    @Column({ name: 'regulation_code', type: 'bigint', nullable: true })
    @Field(() => String, { nullable: true })
    regulationCode?: string;

    @Column({
        type: 'enum',
        enum: SupplierCurrencyEnum,
        nullable: true,
        default: SupplierCurrencyEnum.EUR,
    })
    @Field(() => SupplierCurrencyEnum, { nullable: true })
    currency?: SupplierCurrencyEnum;

    @Column({ type: 'bigint', nullable: true })
    @Field(() => Int, { nullable: true })
    rib?: string;

    @Column({ name: 'billing_address', nullable: true })
    @Field({ nullable: true })
    billingAddress?: string;

    @Column({ type: 'bigint', nullable: true })
    @Field(() => Int, { nullable: true })
    iban?: string;

    @Column({ type: 'bigint', nullable: true })
    @Field(() => Int, { nullable: true })
    bic?: string;

    @Column({ name: 'discount_rate', nullable: true })
    @Field(() => Float, { nullable: true })
    discountRate?: number;

    @Column({ name: 'bank_rate', nullable: true })
    @Field(() => Float, { nullable: true })
    bankRate?: number;

    @Column({ name: 'minimum_order', nullable: true })
    @Field(() => Float, { nullable: true })
    minOrder?: number;

    @Column({
        type: 'enum',
        enum: SupplierConditionEnum,
        nullable: true,
    })
    @Field(() => SupplierConditionEnum, { nullable: true })
    conditions?: SupplierConditionEnum;

    @Column({
        name: 'delivery_mode',
        type: 'enum',
        enum: SupplierDeliveryModeEnum,
        nullable: true,
    })
    @Field(() => SupplierDeliveryModeEnum, { nullable: true })
    deliveryMode?: SupplierDeliveryModeEnum;

    @Column({ name: 'credit_insurer', nullable: true, default: false })
    @Field(() => Boolean, { nullable: true })
    creditInsurer?: boolean;

    @Column({ name: 'insurer_name', nullable: true })
    @Field(() => String, { nullable: true })
    insurerName?: string;

    @Column({ name: 'intra_group', nullable: true, default: false })
    @Field(() => Boolean, { nullable: true })
    intraGroup?: boolean;

    @Column({
        type: 'boolean',
        default: false,
    })
    @Field({ nullable: true })
    public active?: boolean;

    public static isColumnString(value: string): boolean {
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): SupplierBilling {
        return id ? new SupplierBilling({ id: id }) : null;
    }
}
