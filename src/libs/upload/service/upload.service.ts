import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { UPLOAD_PROVIDERS_NAMES } from '../provider/upload.provider';
import { ImageResizeService } from './image.resize.service';
import {
    ImageResizeInterface,
    UPLOAD_IMAGE_MEDIUM_SIZES,
    UPLOAD_IMAGE_SMALL_SIZES,
    UPLOAD_IMAGE_SIZE_MAX,
} from '../dto/interfaces/upload.image.inerfaces';
import { UploadRemoveArg } from '../dto/args/upload.remove.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import * as fs from 'fs';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { UploadEntity } from 'src/entities/psql/UploadEntity';
import { dump, formatNumber, gen, is_type, slug } from 'src/utils/utils';
import {
    extFilename,
    PUBLIC_BASE_DIR,
    removePublicFile,
} from 'src/utils/upload.utils';

/**
 * Base dir of upload files
 */
export const UPLOAD_DIRNAME = 'upload';

/**
 * The default file mode
 */
export const UPLOAD_MODE = '0777';

/**
 * Service of Upload
 */
@Injectable()
export class UploadService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'u.id'],
        ['originalName', 'u.originalName'],
        ['name', 'u.name'],
        ['directory', 'u.directory'],
        ['directoriesNames', 'u.directoriesNames'],
        ['extension', 'u.extension'],
        ['type', 'u.type'],
        ['active', 'u.active'],
        ['title', 'u.title'],
        ['description', 'u.description'],
        ['createdAt', 'u.createdAt'],
        ['updatedAt', 'u.updatedAt'],
        ['deletedAt', 'u.deletedAt'],
        ['createdBy', 'u.createdBy'],
        ['updatedBy', 'u.updatedBy'],
    ]);

    public constructor(
        @Inject(UPLOAD_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultRepository: Repository<UploadEntity>,
        private readonly _imageResizeService: ImageResizeService,
    ) {
        super();
    }

    /**
     * Check if Quick Access Exist
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async exist(
        id?: number | UploadEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof UploadEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Found Quick Access by column search and is value
     * @param value
     * @param column
     * @param id
     * @param withDeleted
     * @param repo
     * @returns
     */
    public async existByColumn(
        value: any,
        column: string,
        id?: number | UploadEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof UploadEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'u',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (UploadEntity.isColumnString(column)) {
                if (
                    column === 'name' &&
                    !UploadService.isValidFilename(value)
                ) {
                    value = UploadService.renameFilename(value);
                }
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, {
                    column_value: value,
                });
            }

            if (id > 0 && column !== 'id')
                qb.andWhere(`${this._cn('id')} != :column_id`, {
                    column_id: id,
                });

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    /**
     * Save multiple file form graphql upload
     * @param files
     * @param resizes
     * @param cb
     * @param existingUpload
     * @param repo
     * @param manager
     * @returns
     */
    public async saveFromGraphqlUploadMultiple(
        files: GraphqlFileUpload[],
        resizes?: ImageResizeInterface,
        cb?: (upload: UploadEntity) => any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<UploadEntity[] | any> {
        return new Promise(async (resolve, reject) => {
            const savedFiles = [];

            for (const i in files) {
                const file = files[i];

                savedFiles.push(
                    await this.saveFromGraphqlUpload(
                        file,
                        resizes,
                        cb,
                        null,
                        repo,
                        manager,
                    ),
                );
            }

            resolve(savedFiles);
        });
    }

    /**
     * Save a file from upload
     * @param file
     * @param resizes
     * @param cb
     * @param existingUpload
     * @param repo
     * @param manager
     * @returns
     */
    public async saveFromGraphqlUpload(
        file: GraphqlFileUpload,
        resizes?: ImageResizeInterface,
        cb?: (upload: UploadEntity) => any,
        existingUpload?: UploadEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<UploadEntity | any> {
        return new Promise(async (resolve, reject) => {
            if (file instanceof GraphqlFileUpload) {
                const data = await file.promise;
                const read: fs.ReadStream = data.createReadStream();
                const buffers: Buffer[] = [];

                // Get Data buffer
                read.on('data', (b: Buffer) => buffers.push(b));

                // Read END event
                read.on('end', async () => {
                    // Set Buffer
                    const buffer = Buffer.concat(buffers);

                    // Get Result
                    const result = await this._saveNewUploadedFile(
                        {
                            originalname: data.filename,
                            mimetype: data.mimetype,
                            buffer: buffer,
                        },
                        resizes,
                        cb,
                        existingUpload,
                        repo,
                        manager,
                    );

                    // Return Result
                    resolve(result);

                    read.destroy();
                });

                // Read error
                read.on('error', (err) => {
                    resolve({
                        error: {
                            name: err.name,
                            message: err.message,
                            stack: err.stack,
                        },
                    });

                    read.destroy();
                });
            } else {
                resolve({
                    error: {
                        message: 'No file uploaded',
                    },
                });
            }
        });
    }

    /**
     * Save multiple file form upload
     * @param files
     * @param resizes
     * @param cb
     * @param existingUpload
     * @param repo
     * @param manager
     * @returns
     */
    public async saveFromUploadMultiple(
        files: Express.Multer.File[],
        resizes?: ImageResizeInterface,
        cb?: (upload: UploadEntity) => any,
        existingUpload?: UploadEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<UploadEntity[] | any> {
        return new Promise(async (resolve, reject) => {
            const savedFiles = [];

            for (const i in files) {
                const file = files[i];

                savedFiles.push(
                    await this.saveFromUpload(
                        file,
                        resizes,
                        cb,
                        existingUpload,
                        repo,
                        manager,
                    ),
                );
            }

            resolve(savedFiles);
        });
    }

    /**
     * Save a file from upload
     * @param file
     * @param resizes
     * @param cb
     * @param existingUpload
     * @param repo
     * @param manager
     * @returns
     */
    public async saveFromUpload(
        file: Express.Multer.File,
        resizes?: ImageResizeInterface,
        cb?: (upload: UploadEntity) => any,
        existingUpload?: UploadEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<UploadEntity | any> {
        return new Promise(async (resolve, reject) => {
            if (file) {
                const result = await this._saveNewUploadedFile(
                    {
                        originalname: file.originalname,
                        mimetype: file.mimetype,
                        buffer: file.buffer,
                    },
                    resizes,
                    cb,
                    existingUpload,
                    repo,
                    manager,
                );

                resolve(result);
            } else {
                resolve({
                    error: {
                        message: 'No file uploaded',
                    },
                });
            }
        });
    }

    /**
     * Return one Upload if exist
     * @param id
     * @param repo
     */
    public async findOne(
        id?: number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<UploadEntity> {
        const qb = this.getRepo(repo).createQueryBuilder(
            'u',
            manager?.queryRunner,
        );

        return qb.andWhere('u.id = :id', { id: id || -1 }).getOne();
    }

    /**
     * Remove an image if exist
     * @param req
     * @param repo
     * @returns
     */
    public async remove(
        req?: UploadRemoveArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof UploadEntity ? id.id : id;
                const upload = await this.findOne(id, repo, transaction);

                if (upload instanceof UploadEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await this._removeFile(upload);
                        await transaction.delete(UploadEntity, upload.id);
                    } else {
                        await transaction.softDelete(UploadEntity, upload.id);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, manager || repo);
    }

    /**
     * Remove file and directory if empty of files
     * @param upload
     * @returns
     */
    public async _removeFile(upload: UploadEntity): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            // Set target image
            const target = upload.isImage() ? 'original' : undefined;

            // Get filename
            const filename = `${PUBLIC_BASE_DIR}${upload.getPath(target)}`;

            // Check directory and remove it
            const directory = `${PUBLIC_BASE_DIR}${upload.getDirectory(
                target,
            )}`;

            // Remove file and his directories if empty
            await removePublicFile(filename, directory);

            if (upload.directoriesNames) {
                for (const _k in upload.directoriesNames) {
                    const directoryName = upload.directoriesNames[_k];

                    // Get filename
                    const _filename = `${PUBLIC_BASE_DIR}${upload.getPath(
                        directoryName,
                    )}`;

                    // Check directory and remove it
                    const _directory = `${PUBLIC_BASE_DIR}${upload.getDirectory(
                        directoryName,
                    )}`;

                    // Remove file and his directories if empty
                    await removePublicFile(_filename, _directory);
                }
            }

            resolve(true);
        });
    }

    /**
     * Save a new uploaded file
     * @param file
     * @param resizes
     * @param cb
     * @param repo
     * @param manager
     * @returns
     */
    private _saveNewUploadedFile(
        file: { originalname: string; mimetype: string; buffer: Buffer },
        resizes?: ImageResizeInterface,
        cb?: (upload: UploadEntity) => any,
        existingUpload?: UploadEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<UploadEntity | any> {
        return this.useTransaction(async (transaction) => {
            if (file) {
                // Get extension of file
                const ext = extFilename(file.originalname);

                // Set old upload
                const oldUpload = existingUpload
                    ? Object.assign(new UploadEntity(), existingUpload)
                    : undefined;

                // Create new Upload
                const newUpload =
                    existingUpload ||
                    new UploadEntity({
                        active: true,
                        directory: this._generateDirectory(),
                    });
                newUpload.originalName = file.originalname;
                newUpload.name = this._generateUniqueName(ext);
                newUpload.extension = ext;
                newUpload.type = file.mimetype;

                // User modification
                if (cb) cb(newUpload);

                // Add original directory if is an image
                if (
                    newUpload.isImage() &&
                    !newUpload.directory.match(/\/original$/i)
                )
                    newUpload.directory += '/original';

                // Check Directory name
                if (
                    !newUpload.directory.match(
                        new RegExp(`^\/${UPLOAD_DIRNAME}\/`),
                    )
                )
                    newUpload.directory = `/${UPLOAD_DIRNAME}/${newUpload.directory}`;
                newUpload.directory = newUpload.directory.replace(
                    /[\/]{2,}/,
                    '/',
                );
                newUpload.directory = newUpload.directory.replace(/[\/]+$/, '');
                if (!newUpload.directory.match(/^\//))
                    newUpload.directory = `/${newUpload.directory}`;

                // Check name
                if (!UploadService.isValidFilename(newUpload.name)) {
                    newUpload.name = UploadService.renameFilename(
                        newUpload.name,
                        ext,
                    );
                }

                // Check name extension
                if (!newUpload.name.match(new RegExp(`\.${ext}$`, 'i'))) {
                    newUpload.name += `.${ext}`;
                }

                const dirname = `${PUBLIC_BASE_DIR}${newUpload.directory}`;
                const filename = `${dirname}/${newUpload.name}`;

                // Check if dir exist
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, {
                        recursive: true,
                        mode: UPLOAD_MODE,
                    });
                }

                // Copy uploaded file
                fs.writeFileSync(filename, file.buffer, {
                    mode: UPLOAD_MODE,
                    encoding: 'utf8',
                });

                // Resize if is an image
                if (newUpload.isImage()) {
                    const resized = await this._resizeImage(newUpload, resizes);
                }

                // Save new upload
                const savedUpload = await transaction.save(newUpload);

                if (savedUpload) {
                    if (oldUpload) await this._removeFile(oldUpload);
                    return this.findOne(savedUpload.id, repo, transaction);
                }
            } else {
                return {
                    error: {
                        message: 'No file uploaded',
                    },
                };
            }
        }, manager || repo);
    }

    /**
     * Resize an image upload
     * @param upload
     * @param resizes
     * @returns
     */
    private _resizeImage(
        upload: UploadEntity,
        resizes: ImageResizeInterface,
    ): Promise<UploadEntity> {
        return new Promise(async (resolve, reject) => {
            // Add default medium and small resizes
            if (!resizes)
                resizes = { thumbnail: { width: UPLOAD_IMAGE_SIZE_MAX } };
            if (!resizes.medium) resizes.medium = UPLOAD_IMAGE_MEDIUM_SIZES;
            if (!resizes.small) resizes.small = UPLOAD_IMAGE_SMALL_SIZES;

            // Resize image by resizes infos
            await this._imageResizeService.resizeImage(
                `${PUBLIC_BASE_DIR}/${upload.directory}`,
                upload.name,
                resizes,
            );

            // Init directories names array
            upload.directoriesNames = [];

            // Put directories names from resizes keys
            for (const _dirname in resizes) {
                upload.directoriesNames.push(_dirname);
            }

            resolve(upload);
        });
    }

    /**
     * Generate Directory path
     * @returns
     */
    private _generateDirectory(): string {
        const now = new Date();
        return `/${UPLOAD_DIRNAME}/${now.getFullYear()}/${formatNumber(
            now.getMonth() + 1,
        )}`;
    }

    /**
     * Generate unique filename
     * @param ext
     * @returns
     */
    private _generateUniqueName(ext: string): string {
        const now = new Date();
        let name = 'UPL_';
        name += now.getFullYear();
        name += formatNumber(now.getMonth() + 1);
        name += formatNumber(now.getDate());
        name += formatNumber(now.getHours());
        name += formatNumber(now.getMinutes());
        name += formatNumber(now.getSeconds());
        name += '_';
        name += gen(10, true, false, true, false);
        name += `.${ext}`;
        return name;
    }

    /**
     * Return current repo
     * @param repo
     * @returns
     */
    public getRepo(repo?: string): Repository<UploadEntity> {
        return this._defaultRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return UploadService.ColumnQueryNames.get(columnName);
    }

    /**
     * Check if is valid filename
     * @param filename
     * @returns
     */
    public static isValidFilename(filename?: string): boolean {
        if (!filename) return true;

        return !!filename.toString().match(/^[a-z0-9\_\-\.]+$/i);
    }

    /**
     * Rename the filename
     * @param filename
     * @returns
     */
    public static renameFilename(
        filename?: string,
        extension?: string,
    ): string | undefined {
        if (!this.isValidFilename(filename)) {
            const ext = extFilename(filename) || extension;
            filename = `${slug(filename.replace(`.${ext}`, ''))}.${ext}`;
        }

        return filename;
    }
}
