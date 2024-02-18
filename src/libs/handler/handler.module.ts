import { Module } from '@nestjs/common';
import { RequestContextModule } from 'nestjs-request-context';
import { HandlerRequestService } from './service/request/handler.request.service';

@Module({
    imports: [
        RequestContextModule,
    ],
    exports: [
        HandlerRequestService,
    ],
    providers: [
        HandlerRequestService,
    ],
})
export class HandlerModule { }
