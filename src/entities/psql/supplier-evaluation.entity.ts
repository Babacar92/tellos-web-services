import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from '@/entities/psql/supplier.entity';
import { LoginEntity } from '@Entities/LoginEntity';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { Field, Int } from '@nestjs/graphql';

@Entity({ name: 'supplier_evaluation' })
export class SupplierEvaluation {
    public constructor(data?: Partial<SupplierEvaluation>) {
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

    @Column()
    public supplierId: number;

    @ManyToOne(() => LoginEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @Field(() => LoginEntity)
    @JoinColumn()
    public login?: LoginEntity;

    @Column()
    public login_id?: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    public comment?: string;

    @Column()
    @Field(() => Int)
    public note?: number;

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
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): SupplierEvaluation {
        return id ? new SupplierEvaluation({ id: id }) : null;
    }
}
