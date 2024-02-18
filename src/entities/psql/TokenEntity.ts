import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TOKENS_NAMES } from "../../types/tokens.const";

/**
 * Token Entity
 */
@Entity({ name: 'token' })
export class TokenEntity {

    /**
     * The constructor of Token Entity
     * @param data 
     */
    public constructor(data?: TokenEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Token
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Name of Token
     */
    @Column({
        type: 'enum',
        enum: TOKENS_NAMES,
    })
    public name?: string;

    /**
     * Value of Token
     */
    @Column({
        unique: true,
        length: 255,
    })
    public value?: string;

    @Column({
        type: 'timestamp',
    })
    public expireAt?: Date;

    /**
     * Deleted column
     */
    @DeleteDateColumn({
        //
    })
    public deletedAt?: Date;

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
     * Check if is valid
     */
    public isValid?(): boolean {
        return this.expireAt >= new Date();
    }

}