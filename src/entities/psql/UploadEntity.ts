import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { TranslationColumn } from '../../libs/databases/decorators/columns/TranslationColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';

/**
 * Upload Entity Database
 */
@Entity({ name: 'upload' })
@Unique(['name', 'deletedAt'])
export class UploadEntity {
    /**
     * The constructor of Upload Entity
     * @param data
     */
    public constructor(data?: UploadEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Upload
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Original name of Upload
     */
    @Column({
        length: 255,
    })
    public originalName?: string;

    /**
     * Name of Upload
     */
    @Column({
        length: 255,
    })
    public name?: string;

    /**
     * Directory of Upload
     */
    @Column({
        length: 255,
    })
    public directory?: string;

    /**
     * Directory of Upload
     */
    @Column({
        type: 'json',
        nullable: true,
    })
    public directoriesNames?: string[];

    /**
     * Extension of Upload
     */
    @Column({
        length: 255,
    })
    public extension?: string;

    /**
     * Type of Upload
     */
    @Column({
        length: 255,
    })
    public type?: string;

    /**
     * Title of Upload
     */
    @TranslationColumn({
        nullable: true,
    })
    public title?: string;

    /**
     * Title of Upload
     */
    @TranslationColumn({
        nullable: true,
    })
    public description?: string;

    /**
     * Active mode of upload
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
     * the upload full path
     */
    public fullpath?: any;

    /**
     * the upload full paths
     */
    public fullpaths?: any;

    /**
     * Return fullpath
     * @returns
     */
    public getPath?(target?: string): string {
        return `${this.getDirectory(target)}/${this.name}`;
    }

    /**
     * Return directory if set
     * @param target
     * @returns
     */
    public getDirectory?(target?: string): string {
        // Use Thumbnail by default for an image
        if (this.isImage() && !target) target = 'thumbnail';

        if (this.directoriesNames?.find((_d) => _d === target)) {
            return this.directory?.replace(/[a-z0-9\_\-\. ]+$/i, target);
        }

        return this.directory;
    }

    /**
     * Check if is an image
     * @returns
     */
    public isImage?(): boolean {
        return !!this.type?.match(/(image|img)/i);
    }

    /**
     * Apply any instruction after load
     */
    @AfterLoad()
    public afterLoad?(): void {
        // Set default fullpath and other fullpaths
        if (this.name && this.directory && this.directoriesNames) {
            if (this.isImage()) {
                this.fullpaths = { original: this.getPath('original') };

                this.directoriesNames.forEach((d) => {
                    const value = this.getPath(d);
                    if (d === 'thumbnail') {
                        this.fullpaths.default = value;
                        this.fullpath = value;
                    } else {
                        this.fullpaths[d] = value;
                    }
                });
            }
        } else {
            this.fullpath = this.getPath();
        }
    }

    public static isColumnString(value: string): boolean {
        return !!value.match(
            /^(originalName|name|directory|extension|type|title|description|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of UploadEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): UploadEntity {
        return id ? new UploadEntity({ id: id }) : null;
    }
}
