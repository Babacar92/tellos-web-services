import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../libs/databases/databases.module";
import { TOKEN_PROVIDERS } from "./provider/token.providers";
import { TokenService } from './service/token.service';

/**
 * Token modul
 */
@Module({
    imports: [
        DatabaseModule,
    ],
    providers: [
        ...TOKEN_PROVIDERS,
        TokenService,
    ],
    exports: [
        TokenService,
    ],
})
export class TokenModule {

}