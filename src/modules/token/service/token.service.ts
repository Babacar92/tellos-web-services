import { Inject, Injectable } from '@nestjs/common';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { EntityManager, Repository } from 'typeorm';
import { TokenEntity } from '../../../entities/psql/TokenEntity';
import { TOKENS_TYPES } from '../../../types/tokens.const';
import { gen } from '../../../utils/utils';
import { TOKEN_PROVIDERS_NAMES } from '../provider/token.providers';

/**
 * Service Token
 */
@Injectable()
export class TokenService extends AbstractRepositoryService {

    public constructor(
        @Inject(TOKEN_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultTokenRepository: Repository<TokenEntity>
    ) {
        super();
    }

    /**
     * Check if the value of token is valid
     * @param value 
     * @param repo 
     * @returns 
     */
    public async isValid(
        value: string,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const qb = this.getRepo(repo)
                .createQueryBuilder("t", manager?.queryRunner)
                .select("COUNT(t.id) AS total")
                .andWhere("t.value = :value", { value: value })
                .andWhere("t.expireAt > NOW()");

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    /**
     * Create new Token
     * @param type 
     * @param expireAt 
     * @returns 
     */
    public async save(
        type: TOKENS_TYPES,
        value?: string,
        expireAt: string = "1d",
        repo?: string,
        manager?: EntityManager,
    ): Promise<TokenEntity> {
        return this.useTransaction(async transaction => {
            if (!type || !expireAt) return;
            const newToken = new TokenEntity();

            newToken.name = type;
            newToken.value = value || gen(60, true, true, true, false);

            const expireDate = this.getExpireAt(expireAt);

            newToken.expireAt = expireDate;

            return transaction.save(newToken);
        }, (manager || repo));
    }

    /**
     * Return date for expiration
     * @param expireAt 
     * @returns 
     */
    public getExpireAt(expireAt: string): Date {
        const expireDate = new Date();

        if (expireAt.match(/^[0-9]+d$/i)) {
            let more = parseInt(expireAt.replace(/d/i, ''));
            expireDate.setDate(expireDate.getDate() + more);
        } else if (expireAt.match(/^[0-9]+w$/i)) {
            let more = parseInt(expireAt.replace(/w/i, ''));
            expireDate.setDate(expireDate.getDate() + (more * 7));
        } else if (expireAt.match(/^[0-9]+m$/i)) {
            let more = parseInt(expireAt.replace(/m/i, ''));
            expireDate.setMonth(expireDate.getMonth() + 1 + more);
        } else if (expireAt.match(/^[0-9]+y$/i)) {
            let more = parseInt(expireAt.replace(/y/i, ''));
            expireDate.setFullYear(expireDate.getFullYear() + more);
        } else {
            expireDate.setDate(expireDate.getDate() + 1);
        }

        expireDate.setUTCHours(23, 59, 59, 999);

        return expireDate;
    }

    public getRepo(repo?: string): Repository<any> {
        return this._defaultTokenRepository;
    }

}
