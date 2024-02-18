import { dump } from './utils';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const { PWD, SOURCE_CODE } = process.env;

/**
 * Base dir of upload files
 */
export const PUBLIC_BASE_DIR = `${PWD}${SOURCE_CODE}/public`;

/**
 * Type of File data
 */
export type FileDataType = {
    fullPath: string;
    path: string;
    dirname: string;
    name: string;
    extension: string;
    exist: boolean;
    size?: number;
    buffer?: Buffer;
    createdAt?: Date;
    updatedAt?: Date;
};

/**
 * Remove file and his directory if empty
 */
export const removePublicFile = async (
    filename: string,
    directory?: string,
) => {
    if (filename) {
        // Get directory of file if not set
        if (!directory)
            directory = filename.replace(/\/[a-z0-9\_\-\. ]+$/i, '');

        // Check if is u public path
        if (!filename.includes(PUBLIC_BASE_DIR)) return;
        else if (!directory.includes(PUBLIC_BASE_DIR)) return;

        // Remove file
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
        }

        if (fs.existsSync(directory)) {
            // Check directory and remove it if empty
            while (PUBLIC_BASE_DIR !== directory) {
                const dirFiles = fs.readdirSync(directory);

                if (!dirFiles.length) {
                    fs.rmdirSync(directory);
                    directory = directory.replace(/\/[a-z0-9\_\-\. ]+$/i, '');
                } else {
                    directory = PUBLIC_BASE_DIR;
                }
            }
        }
    }
};

/**
 * Return data of file data
 * @param filename
 * @returns
 */
export const fileData = (filename: string): FileDataType => {
    filename = filename.replace(/[\/]+/g, '/');
    const split = filename.split('/');
    let dirname = filename.replace(`/${split[split.length - 1]}`, '');
    let path = filename.replace(`${PWD}${SOURCE_CODE}`, '');
    const ext = filename.match(/[a-z0-9]+$/i);

    // Add slash top front of filename
    if (!filename.match(/^\//)) filename = `/${filename}`;

    // Add slash top front of dirname
    if (!dirname.match(/^\//)) dirname = `/${dirname}`;

    // Add slash top front of path
    if (!path.match(/^\//)) path = `/${path}`;

    // Init data
    const data: FileDataType = {
        fullPath: filename,
        path: path,
        dirname: dirname,
        extension: ext ? ext[0] : null,
        name: split[split.length - 1].replace(ext ? `.${ext[0]}` : '', ''),
        exist: fs.existsSync(filename),
    };

    if (data.exist) {
        const { size, birthtime, mtime } = fs.statSync(filename);

        data.size = size;
        data.createdAt = new Date(birthtime);
        data.updatedAt = new Date(mtime);
    }

    return data;
};

/**
 * Return the filename extension
 * @param filename
 * @returns
 */
export const extFilename = (filename?: string) => {
    if (filename) {
        const ext = filename.match(/[a-z0-9]+$/i);
        return ext ? ext[0] : null;
    }
    return;
};
