import { Provider } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";

export enum GRAPHQL_PROVIDERS_NAMES {
    PUB_SUB = "GRAPHQL_PUB_SUB",
}

export const GRAPHQL_PROVIDERS: Provider[] = [
    // PubSub provider
    {
        provide: GRAPHQL_PROVIDERS_NAMES.PUB_SUB,
        useValue: new PubSub(),
    },
];