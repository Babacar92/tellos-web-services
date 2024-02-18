import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { CONTRACT_CATEGORY_ENUM } from "src/modules/contract/dto/enums/contract.category.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'paragraph_frame' })
export class ParagraphFrameEntity {

    /**
     * The constructor of Permission Entity
     * @param data 
     */
    public constructor(data?: ParagraphFrameEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of paragraph frame
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Category of paragraph frame
     */
    @Column({
        type: 'enum',
        enum: CONTRACT_CATEGORY_ENUM,
        nullable: true,
    })
    public category?: CONTRACT_CATEGORY_ENUM;

    /**
     * Title of paragraph frame
     */
    @Column({
        nullable: true,
    })
    public title?: string;

    /**
     * Content of paragraph frame
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    public content?: string;

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
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(name|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of ParagraphFrameEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): ParagraphFrameEntity {
        return id ? new ParagraphFrameEntity({ id: id }) : null;
    }

}