import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Supplier } from '@/entities/psql/supplier.entity';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { Field, Int } from '@nestjs/graphql';

@Entity({ name: 'supplier_agency' })
@Unique(['name', 'deletedAt'])
export class SupplierAgency {
    public constructor(data?: Partial<SupplierAgency>) {
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    public id?: number;

    @ManyToOne(() => Supplier, {
        onDelete: 'SET NULL',
    })
    @Field(() => Supplier)
    @JoinColumn()
    public supplier: Supplier;

    @Column({ name: 'supplier_id' })
    supplierId: number;

    @Column()
    @Field(() => String)
    public name: string;

    @Column()
    @Field(() => String)
    public address: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    public addressBis?: string;

    @Column()
    @Field(() => String)
    public postcode: string;

    @Column()
    @Field(() => String)
    public city: string;

    @Column()
    @Field(() => String)
    public country: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    public phone?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    public fax?: string;

    @Column({
        type: 'boolean',
        default: true,
    })
    @Field(() => Boolean)
    public active?: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @CreatedByColumn()
    createdBy?: string;

    @UpdatedByColumn()
    updatedBy?: string;

    public static isColumnString(value: string): boolean {
        return !!value.match(
            /^(name|address|addressBis|postcode|city|country|phone|fax|createdBy|updatedBy)$/i,
        );
    }

    public static init(id?: number): SupplierAgency {
        return id ? new SupplierAgency({ id: id }) : null;
    }
}
