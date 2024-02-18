import { Inject } from '@nestjs/common';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { LoginEntity } from 'src/entities/psql/LoginEntity';
import { Command } from 'src/libs/bin/console/decorators/command.decorator';
import { AbstractCommand } from 'src/libs/bin/console/dto/abstract/abstract.command';
import { COMMAND_REPONSE_CODE } from 'src/libs/bin/console/dto/enum/command.response.code.enum';
import { CommandArgsInterface } from 'src/libs/bin/console/dto/interface/command.args.interface';
import { Input } from 'src/libs/bin/console/dto/terminal/terminal.input';
import { Output } from 'src/libs/bin/console/dto/terminal/terminal.output';
import { EncryptionService } from 'src/libs/databases/services/encryption.service';
import { DataSource, SelectQueryBuilder } from 'typeorm';

@Command({ name: 'fetch:unexist:encryption' })
export class FetchUnexistEncryptionCommand extends AbstractCommand {
    public name = 'fetch:unexist:encryption';

    public description =
        'Fetch the all encryption and save it in encryptions file';

    private count = 0;

    public constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private readonly connection: DataSource,
    ) {
        super();
    }

    public init(args: CommandArgsInterface): void | Promise<void> {}

    public async execute(
        input: Input,
        output: Output,
    ): Promise<COMMAND_REPONSE_CODE> {
        let offset = 0;
        const limit = 1000;

        // Get Query Builder
        const qb = this._getQueryBuilder(offset, limit);

        // Get total line
        const total = await qb.getCount();

        // Get result
        const result = await qb.getRawMany();

        // Save encryption
        this._saveUnexistEncryption(result, output);

        // Loop if anathor data exist
        while (offset < total) {
            offset += limit;

            // Get Query Builder
            const qb2 = this._getQueryBuilder(offset, limit);

            // Get total line
            const total2 = await qb2.getCount();

            // Get result
            const result2 = await qb2.getRawMany();

            // Save encryption
            this._saveUnexistEncryption(result2, output);
        }

        if (!this.count) {
            output.info('No encrypted values are missing');
        }

        return COMMAND_REPONSE_CODE.SUCCESS;
    }

    private _saveUnexistEncryption(result: any[], output: Output): void {
        for (const i in result) {
            const value = result[i];

            for (const key in value) {
                const encryption = value[key];

                if (encryption && !EncryptionService.hasHashValue(encryption)) {
                    const decryption = EncryptionService.decrypt(encryption);

                    output.write(`Hash value {hash} to {value}`, {
                        hash: output.color(encryption, 'success'),
                        value: output.color(decryption, 'success'),
                    });

                    if (!this.count) this.count++;
                }
            }
        }
    }

    private _getQueryBuilder(
        offset: number,
        limit: number,
    ): SelectQueryBuilder<any> {
        // Init query builder
        const qb = this.connection
            .createEntityManager()
            .createQueryBuilder()
            .from(Employee, 'e')
            .limit(limit)
            .offset(offset);

        // Selection of Employee
        qb.addSelect('e.emailPro', 'e_emailPro')
            .addSelect('e.emailPerso', 'e_emailPerso')
            .addSelect('e.lastname', 'e_lastname')
            .addSelect('e.lastnameBis', 'e_lastnameBis')
            .addSelect('e.firstname', 'e_firstname');

        // Selection of Login
        qb.leftJoin(LoginEntity, 'l')
            .addSelect('l.firstname', 'l_firstname')
            .addSelect('l.lastname', 'l_lastname')
            .addSelect('l.email', 'l_email')
            .addSelect('l.username', 'l_username');

        return qb;
    }
}
