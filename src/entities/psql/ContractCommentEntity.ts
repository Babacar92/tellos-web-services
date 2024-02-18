import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Employee } from './EmployeeEntity';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { ContractEntity } from './ContractEntity';

@Entity({
    name: 'contract_comment',
})
export class ContractCommentEntity {
    /**
     * The constructor of Comment Entity
     * @param data
     */
    public constructor(data?: ContractCommentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of CommentEntity
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Employee proprietaire
     */
    @ManyToOne(() => Employee, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * Contract preview
     */
    @ManyToOne(() => ContractEntity, (contract) => contract.comments, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public contract?: ContractEntity;

    /**
     * comment
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public comment?: string;

    /**
     * Is enable
     */
    @Column({
        type: 'boolean',
        default: true,
    })
    public active?: boolean;

    /**
     * Created column
     */
    @CreateDateColumn({
        // ...
    })
    public createdAt?: Date;

    /**
     * Updated column
     */
    @UpdateDateColumn({
        // ...
    })
    public updatedAt?: Date;

    /**
     * Deleted column
     */
    @DeleteDateColumn({
        //
    })
    public deletedAt?: Date;

    /**
     * Creator column
     */
    @CreatedByColumn()
    public createdBy?: string;

    /**
     * Editor column
     */
    @UpdatedByColumn()
    public updatedBy?: string;

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of ContractEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): ContractCommentEntity {
        return id ? new ContractCommentEntity({ id: id }) : null;
    }
}
