import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { GITIGNORE_FILENAME } from 'src/libs/translation/service/translation.service';
import { UPLOAD_MODE } from 'src/libs/upload/service/upload.service';
import { dump } from '../../../utils/utils';
import { fileData } from 'src/utils/upload.utils';

dotenv.config();

const {
  CRYPTO_SECRET_KEY,
  CRYPTO_HASH_LENGTH,
  CRYPTO_ALGORITHM,
  PWD,
  SOURCE_CODE,
  APP_ENV,
} = process.env;

export declare type EncryptionSearchMatchType = 'LIKE' | 'EQUAL';

export declare type EncryptionSearchResultType = {
  hash?: string;
  raw?: string;
}[];

/**
 * Encryption dirname
 */
export const ENCRYPTIONS_DIRNAME = `${PWD}${SOURCE_CODE}/encryptions`;

/**
 * Encryption filename
 */
export const ENCRYPTIONS_FILENAME = `${ENCRYPTIONS_DIRNAME}/encryption.json`;

class EncryptionClassService {
  /**
   * The constructor
   * @param values
   * @param hashs
   * @param raws
   * @param initialized
   * @param lastupdate
   */
  public constructor(
    private values: { [key: string]: string } = {},
    private hashs: string[] = [],
    private raws: string[] = [],
    private initialized: boolean = false,
    private lastupdate?: Date,
  ) {}

  /**
   * Search an existing encrypted value
   * @param value
   * @param searchMatch
   * @returns
   */
  public search(
    value: string,
    searchMatch: EncryptionSearchMatchType = 'LIKE',
  ): EncryptionSearchResultType {
    // Init the encyptions data if not exist
    this._init();

    // Search all match
    const found = this.raws.filter((r) => {
      return searchMatch === 'LIKE'
        ? r.toLowerCase().includes(value?.toLowerCase())
        : r.toLowerCase() === value?.toLowerCase();
    });

    // Create response list
    const response: EncryptionSearchResultType = [];

    // Add found values
    found.forEach((raw) => {
      response.push({
        raw: raw,
        hash: this.hashs[this.raws.indexOf(raw)],
      });
    });

    return response;
  }

  /**
   * Check if raw value exist
   * @param value
   * @returns
   */
  public hasRawValue(value: string): boolean {
    // Init the encyptions data if not exist
    this._init();

    return !!value && !!this.raws.find((r) => r === value);
  }

  /**
   * Check if hash value exist
   * @param value
   * @returns
   */
  public hasHashValue(value: string): boolean {
    // Init the encyptions data if not exist
    this._init();

    return !!value && !!this.hashs.find((h) => h === value);
  }

  /**
   * Encrypt value
   * @param value
   * @param encoding
   * @returns
   */
  public encrypt(value?: string, encoding: BufferEncoding = 'hex') {
    // Init the encyptions data if not exist
    this._init();

    if (!value) return;

    if (!this.hasRawValue(value)) {
      // Set IV
      const iv = crypto.randomBytes(16);

      // Set CIPHER
      const cipher = crypto.createCipheriv(
        CRYPTO_ALGORITHM,
        CRYPTO_SECRET_KEY,
        iv,
      );

      // Set encrypted
      const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);

      // IV string
      const ivString = iv.toString(encoding);
      const ivPart1 = ivString.substring(0, Math.round(ivString.length / 2));
      const ivPart2 = ivString.replace(ivPart1, '');

      // ENCRYPTED string
      const encryptedString = encrypted.toString(encoding);

      const hash = `$p=${ivPart1};$e=${encryptedString};$l=${ivPart2}`;

      this._addNewHash(hash, value);

      return hash;
    }

    return this.hashs[this.raws.indexOf(value)];
  }

  /**
   * Decrypt Hash
   * @param hash
   * @param encoding
   * @returns
   */
  public decrypt(hash?: string, encoding: BufferEncoding = 'hex') {
    // Init the encyptions data if not exist
    this._init();

    if (!hash) return;

    if (!this.hasHashValue(hash)) {
      // Split hash
      const splited = hash.split(/[\;\$]+[a-z]+\=/gi).filter((v) => v);

      // Iv
      const iv = splited[0] + splited[2];

      // Encrypted
      const encrypted = splited[1];

      try {
        // DECIPHER
        const decipher = crypto.createDecipheriv(
          CRYPTO_ALGORITHM,
          CRYPTO_SECRET_KEY,
          Buffer.from(iv, encoding),
        );

        // DECRYPTED
        const decrpyted = Buffer.concat([
          decipher.update(Buffer.from(encrypted, encoding)),
          decipher.final(),
        ]);

        const raw = decrpyted.toString();

        this._addNewHash(hash, raw);

        return raw;
      } catch (e) {}
    }

    return this.values[hash];
  }

  /**
   * Hash a password
   * @param password
   * @param saltOrRounds
   * @returns
   */
  public hash(
    password?: string,
    saltOrRounds?: number | string,
  ): string | undefined {
    // Init the encyptions data if not exist
    this._init();

    saltOrRounds = saltOrRounds || +(CRYPTO_HASH_LENGTH || 10);
    if (!this.requireHash(password, saltOrRounds)) return password;
    return bcrypt.hashSync(password, saltOrRounds);
  }

  /**
   * Compare hash and password
   * @param password
   * @param hash
   * @returns
   */
  public compare(password?: string, hash?: string): boolean {
    // Init the encyptions data if not exist
    this._init();

    if (!password || !hash) return false;
    return bcrypt.compareSync(password, hash);
  }

  /**
   * Require the hash or not
   * @param password
   * @param saltOrRounds
   * @returns
   */
  public requireHash(
    password?: string,
    saltOrRounds?: number | string,
  ): boolean {
    // Init the encyptions data if not exist
    this._init();

    if (!password) return false;
    saltOrRounds = saltOrRounds || +(CRYPTO_HASH_LENGTH || 10);

    const hashed = bcrypt.hashSync(password, saltOrRounds),
      part1 = password.match(/\$.*\$/),
      part2 = hashed.match(/\$.*\$/);

    return part1 && part2 ? part1[0] !== part2[0] : true;
  }

  /**
   * Init and get encryption values
   */
  private _init() {
    // Check if file exist
    if (!this.initialized) {
      if (!fs.existsSync(ENCRYPTIONS_FILENAME)) {
        //  Check if dirname exist
        if (!fs.existsSync(ENCRYPTIONS_DIRNAME)) {
          // Create directory
          fs.mkdirSync(ENCRYPTIONS_DIRNAME, {
            recursive: true,
            mode: UPLOAD_MODE,
          });

          // Add gitignore
          fs.writeFileSync(
            `${ENCRYPTIONS_DIRNAME}/.gitignore`,
            `*\n!${GITIGNORE_FILENAME}`,
            {
              mode: UPLOAD_MODE,
              encoding: 'utf8',
            },
          );
        }

        // Create empty values file
        fs.writeFileSync(ENCRYPTIONS_FILENAME, '{}', {
          mode: UPLOAD_MODE,
          encoding: 'utf8',
        });
      }

      // Importe data values
      Object.assign(
        this.values,
        JSON.parse(
          fs.readFileSync(ENCRYPTIONS_FILENAME, {
            encoding: 'utf8',
          }),
        ),
      );

      const { updatedAt } = fileData(ENCRYPTIONS_FILENAME);

      this.lastupdate = updatedAt;

      // Reset list
      this._resetList();

      // Set initialized
      this.initialized = true;

      // Check if file is updated
      if (APP_ENV === 'prod') this._checkUpdate();
    }
  }

  private _checkUpdate(): void {
    const current = new Date();
    const tomorrow = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate() + 1,
      3,
      0,
      0,
      0,
    );

    const timeout = setTimeout(() => {
      const { updatedAt } = fileData(ENCRYPTIONS_FILENAME);

      if (updatedAt > this.lastupdate) {
        // Importe data values
        this.values = JSON.parse(
          fs.readFileSync(ENCRYPTIONS_FILENAME, {
            encoding: 'utf8',
          }),
        );

        // Reset list
        this._resetList();

        this.lastupdate = updatedAt;
      }

      this._checkUpdate();
    }, tomorrow.getTime() - current.getTime());
  }

  /**
   * Reset list of values
   */
  private _resetList() {
    this.hashs = [];
    this.raws = [];

    for (const hash in this.values) {
      const raw = this.values[hash];

      // Add hash in hashs list
      this.hashs.push(hash);

      // Add raw in raw list
      this.raws.push(raw);
    }
  }

  /**
   * Add new value on list
   * @param hash
   * @param raw
   */
  private _addNewHash(hash: string, raw: string) {
    if (!this.hasHashValue(hash) && !this.hasRawValue(raw)) {
      this.values[hash] = raw;
      fs.writeFileSync(ENCRYPTIONS_FILENAME, JSON.stringify(this.values), {
        mode: UPLOAD_MODE,
        encoding: 'utf8',
      });
      this._resetList();
    }
  }
}

export const EncryptionService = new EncryptionClassService();
