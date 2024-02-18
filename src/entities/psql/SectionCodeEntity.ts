import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { ExpensePostEntity } from './ExpensePostEntity';
import { PurchaseAccountEntity } from './PurchaseAccountEntity';
import { ArticleFamilyEntity } from './ArticleFamilyEntity';
import { Good } from './good.entity';
import { WorkforceRateEntity } from './WorkforceRateEntity';

@Unique(['code', 'deletedAt'])
@Entity({
    name: 'section_code',
})
export class SectionCodeEntity {
    /**
     * The constructor of Section code
     * @param data
     */
    public constructor(data?: SectionCodeEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Section code
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Expense post
     */
    @ManyToOne(
        () => ExpensePostEntity,
        (expensePost) => expensePost.sectionCodes,
        {
            nullable: true,
            onDelete: 'SET NULL',
        },
    )
    @JoinColumn()
    public expensePost?: ExpensePostEntity;

    /**
     * List of purchase account
     */
    @OneToMany(
        () => PurchaseAccountEntity,
        (PurchaseAccount) => PurchaseAccount.sectionCode,
        {},
    )
    public purchaseAccounts?: PurchaseAccountEntity[];

    /**
     * List of article families
     */
    @OneToMany(
        () => ArticleFamilyEntity,
        (ArticleFamily) => ArticleFamily.sectionCode,
        {},
    )
    public articleFamilies?: ArticleFamilyEntity[];

    /**
     * List of goods attached to the section code
     */
    @OneToMany(() => Good, (good) => good.sectionCode, {})
    public goods?: Good[];

    /**
     * List of goods attached to the section code
     */
    @OneToMany(
        () => WorkforceRateEntity,
        (workforceRate) => workforceRate.sectionCode,
        {},
    )
    public workforceRates?: WorkforceRateEntity[];

    /**
     * Code of Section code
     */
    @Column({
        nullable: true,
    })
    public code?: string;

    /**
     * Designation of Section code
     */
    @Column({
        nullable: true,
    })
    public designation?: string;

    /**
     * inventory Change Account
     */
    @Column({
        nullable: true,
    })
    public inventoryChangeAccount?: string;

    /**
     * Active mode of Section code
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
        return !!value.match(
            /^(code|designation|inventoryChangeAccount|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of SectionCodeEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): SectionCodeEntity {
        return id ? new SectionCodeEntity({ id: id }) : null;
    }
}
