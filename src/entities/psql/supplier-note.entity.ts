import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Supplier } from '@/entities/psql/supplier.entity';
import { LoginEntity } from '@Entities/LoginEntity';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { UploadEntity } from '@Entities/UploadEntity';
import { Field, Int } from '@nestjs/graphql';

@Entity({ name: 'supplier_note' })
export class SupplierNoteEntity {
    public constructor(data?: Partial<SupplierNoteEntity>) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Note
     */
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    public id?: number;

    /**
     * Customer of note
     */
    @ManyToOne(() => Supplier, {
        onDelete: 'SET NULL',
    })
    @Field(() => Supplier)
    @JoinColumn()
    public supplier: Supplier;

    @Column()
    public supplierId: number;

    /**
     * Login of note
     */
    @ManyToOne(() => LoginEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @Field(() => LoginEntity)
    @JoinColumn()
    public login?: LoginEntity;

    @Column({ nullable: true })
    public login_id?: number;

    /**
     * Documents of note
     */
    @ManyToMany(() => UploadEntity, {
        onDelete: 'CASCADE',
    })
    @Field(() => UploadEntity)
    @JoinTable()
    public documents?: UploadEntity[];

    /**
     * Comment of note
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    public comment?: string;

    /**
     * Is enable
     */
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

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): SupplierNoteEntity {
        return id ? new SupplierNoteEntity({ id: id }) : null;
    }
}
