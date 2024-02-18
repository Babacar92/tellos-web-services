import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import {
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
import { SectionCodeEntity } from './SectionCodeEntity';
import { Good } from './good.entity';

/**
 * Article Family Entity
 */
@Entity({
    name: 'article_family',
})
export class ArticleFamilyEntity {
    /**
     * The constructor of Permission Entity
     * @param data
     */
    public constructor(data?: ArticleFamilyEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Article Family
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The parent of Article Family
     */
    @ManyToOne(
        () => ArticleFamilyEntity,
        (articleFamily) => articleFamily.children,
        {
            onDelete: 'CASCADE',
            nullable: true,
        },
    )
    @JoinColumn()
    public parent?: ArticleFamilyEntity;

    /**
     * The section code of Article Family
     */
    @ManyToOne(
        () => SectionCodeEntity,
        (sectionCode) => sectionCode.articleFamilies,
        {
            onDelete: 'CASCADE',
            nullable: true,
        },
    )
    @JoinColumn()
    public sectionCode?: SectionCodeEntity;

    /**
     * The children of Article Family
     */
    @OneToMany(
        () => ArticleFamilyEntity,
        (articleFamily) => articleFamily.parent,
        {},
    )
    public children?: ArticleFamilyEntity[];

    /**
     * The label of Article Family
     */
    @Column({
        length: 255,
        nullable: true,
    })
    public label?: string;

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
        return !!value.match(/^(label|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of ArticleFamilyEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): ArticleFamilyEntity {
        return id ? new ArticleFamilyEntity({ id: id }) : null;
    }
}
