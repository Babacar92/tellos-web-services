import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as dotenv from 'dotenv';
import { GraphqlWebsocketService } from './service/graphql.websocket.service';
import { GRAPHQL_PROVIDERS } from './dto/provider/graphql.providers';
import { EntityModule } from 'src/modules/entity/entity.module';
import { DataloaderFactory } from '../../modules/dataloader/dataloader.factory';
import { DataloaderModule } from 'src/modules/dataloader/dataloader.module';
dotenv.config();

const { GRAPHQL_DEBUG, GRAPHQL_PLAYGROUND, GRAPHQL_INTROSPECTION } =
    process.env;

export const GRAPHQL_PATH_NAME = 'gql';

@Module({
    imports: [
        EntityModule,
        DataloaderModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [DataloaderModule],
            inject: [DataloaderFactory],
            useFactory: (factory: DataloaderFactory) => {
                return {
                    typePaths: ['**/definitions/*.graphql'],
                    path: `/${GRAPHQL_PATH_NAME}`,
                    debug: GRAPHQL_DEBUG === 'true',
                    playground: GRAPHQL_PLAYGROUND === 'true',
                    introspection: GRAPHQL_INTROSPECTION === 'true',
                    useGlobalPrefix: true,
                    context: ({ req, res }) => {
                        return {
                            req,
                            res,
                            entityLoader: factory.entityLoader(),
                            categoryEquipmentLoader:
                                factory.categoryEquipmentLoader(),
                            employeeLoader: factory.employeeLoader(),
                            equipmentParkLoader: factory.equipmentParkLoader(),
                            equipmentFundingLoader:
                                factory.equipmentFundingLoader(),
                            ownerEntityLoader: factory.ownerEntityLoader(),
                            equipmentTechnicalGenreLoader:
                                factory.equipmentTechnicalGenreLoader(),
                            equipmentTechnicalThumbnailLoader:
                                factory.equipmentTechnicalThumbnailLoader(),
                            documentTypeLoader: factory.documentTypeLoader(),
                            customerLoader: factory.customerLoader(),
                            loginLoader: factory.loginLoader(),
                            supplierLoader: factory.supplierLoader(),
                            supplierLanguageCodeLoader:
                                factory.supplierLanguageCodeLoader(),
                            supplierCategoryLoader:
                                factory.supplierCategoryLoader(),
                            equipmentParkUploadLoader:
                                factory.equipmentParkUploadLoader(),
                            equipmentParkSheetUploadLoader:
                                factory.equipmentParkSheetUploadLoader(),
                            equipmentTechnicalGoodsLoader:
                                factory.equipmentTechnicalGoodsLoader(),
                            mediumSizedCenterLoader:
                                factory.mediumSizedCenterLoader(),
                            obligationTypeLoader:
                                factory.obligationTypeLoader(),
                            equipmentParkDocumentUploadLoader:
                                factory.equipmentParkDocumentUploadLoader(),
                            supplierNoteDocumentUploadLoader:
                                factory.supplierNoteDocumentUploadLoader(),
                            constructionSiteLoader:
                                factory.constructionSiteLoader(),
                        };
                    },
                    subscriptions: {
                        'graphql-ws': true,
                    },
                };
            },
        }),
    ],
    providers: [...GRAPHQL_PROVIDERS, GraphqlWebsocketService],
    exports: [GraphqlWebsocketService],
})
export class GraphModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                graphqlUploadExpress({
                    maxFileSize: 10000000,
                    maxFiles: 20,
                }),
            )
            .forRoutes(GRAPHQL_PATH_NAME);
    }
}
