import { MailerService } from '@nestjs-modules/mailer';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { MailerRequestArg } from '../dto/args/mailer.request.arg';

@Resolver()
export class MailerResolver {

    /**
     * The constructor
     * @param _mailerService 
     */
    public constructor(
        private readonly _mailerService: MailerService,
    ) { }

    /**
     * Send email of user
     * @returns 
     */
    @Query(null, {
        name: 'mailerExample'
    })
    public async mailerExample(
        @Args('mailerRequest')
        mailerRequest: MailerRequestArg,
    ): Promise<{ sent: boolean, err?: string }> {
        return new Promise(async (resolve, reject) => {
            this._mailerService.sendMail({
                to: mailerRequest.email,
                subject: mailerRequest.subject,
                template: './example.hbs',
                context: {
                    title: mailerRequest.title,
                    body: mailerRequest.body,
                },
            })
                .then(res => {
                    resolve({
                        sent: true,
                    });
                })
                .catch(err => {
                    resolve({
                        sent: false,
                        err: err.message,
                    });
                });
        });
    }

}
