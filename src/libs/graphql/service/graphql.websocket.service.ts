import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GRAPHQL_PROVIDERS_NAMES } from '../dto/provider/graphql.providers';
import { dump } from 'src/utils/utils';

@Injectable()
export class GraphqlWebsocketService {

    /**
     * Constructor
     * @param _pubSub 
     */
    public constructor(
        @Inject(GRAPHQL_PROVIDERS_NAMES.PUB_SUB)
        private readonly _pubSub: PubSub,
    ) { }

    public test() {
        // this._pubSub.subscribe
        // this._pubSub.unsubscribe
    }

    /**
     * 
     * @param triggers 
     * @returns 
     */
    public asyncIterator(triggers: string | string[]): AsyncIterator<any> {
        return this._pubSub.asyncIterator(triggers);
    }

    /**
     * 
     * @param triggerName 
     * @param payload 
     */
    public async publish(triggerName: string, payload: any, userId?: number): Promise<void> {
        const data: any = {
            [triggerName]: payload,
        };

        if (userId) data.userId = userId;

        return this._pubSub.publish(triggerName, data);
    }

    /**
     * 
     * @param triggerName 
     * @param onMessage 
     * @returns 
     */
    public async subscribe(triggerName: string, onMessage: (...args: any[]) => void): Promise<number> {
        return this._pubSub.subscribe(triggerName, onMessage);
    }

    /**
     * 
     * @param subId 
     * @returns 
     */
    public unsubscribe(subId: number) {
        return this._pubSub.unsubscribe(subId);
    }

}
