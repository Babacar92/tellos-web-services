import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CONTRACT_STATUS_ICON } from '../../modules/contract-info/dto/enums/contract-info.enum';
import { ContractCommentEntity } from './ContractCommentEntity';
import { ContractEnum } from '../../modules/employee/dto/enums/employee.contract.enum';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { Employee } from './EmployeeEntity';
import { UPLOAD_DIRNAME } from '../../libs/upload/service/upload.service';
import { gen } from '../../utils/utils';

@Entity({
    name: 'contract',
})
export class ContractEntity {
    /**
     * The constructor of Contract Preview Entity
     * @param data
     */
    public constructor(data?: ContractEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Contract Preview
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Uploaded file name
     */
    @Column({
        nullable: true,
    })
    public filename?: string;

    /**
     * The info
     */
    @ManyToOne(() => Employee, (info) => info.contracts, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * List of comments
     */
    @OneToMany(() => ContractCommentEntity, (comment) => comment.contract, {})
    public comments?: ContractCommentEntity[];

    /**
     * Text of Contract Preview
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public text?: string;

    /**
     *  status
     */
    @Column({
        type: 'enum',
        enum: CONTRACT_STATUS_ICON,
        nullable: true,
    })
    public status?: CONTRACT_STATUS_ICON;

    /**
     * type of contract
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: ContractEnum,
    })
    public type?: ContractEnum;

    /**
     * isSigned
     */
    @Column({
        type: 'boolean',
        nullable: true,
    })
    public isSigned?: boolean;

    /**
     * documentId code of contract
     */
    @Column({
        nullable: true,
    })
    public youSignDocumentId?: string;

    /**
     * Yousign Signature request ID of contract
     */
    @Column({
        nullable: true,
    })
    public youSignSignatureRequestId?: string;

    /**
     * Yousign ID of target user to sign  of contract
     */
    @Column({
        nullable: true,
    })
    public youSignTargetUserToSignId?: string;

    /**
     * Is enable
     */
    @Column({
        type: 'boolean',
        default: false,
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
     * The fullpath
     */
    public fullpath?: string;

    /**
     * The shortpath
     */
    public shortpath?: string;

    /**
     * Set values after load
     */
    @AfterLoad()
    public afterLoad?() {
        if (this.filename) {
            this._setPaths();
        }
    }

    public generateNameIfnotExists?() {
        if (!this.filename) {
            this.filename = `${gen(14, true, true, true, false)}.pdf`;
            this._setPaths();
        }
    }

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(text|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of ContractEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): ContractEntity {
        return id ? new ContractEntity({ id: id }) : null;
    }

    private _setPaths?() {
        this.shortpath = `contract/${this.filename}`;
        this.fullpath = `${UPLOAD_DIRNAME}/pdf/${this.shortpath}`;
    }
}
