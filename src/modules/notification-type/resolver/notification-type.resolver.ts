import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationTypeEntity } from 'src/entities/psql/NotificationTypeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { NotificationTypeCreateArgInput } from '../dto/args/notification-type.create.arg.input';
import { NotificationTypeFilterArgInput } from '../dto/args/notification-type.filter.arg.input';
import { NotificationTypeRemoveArgInput } from '../dto/args/notification-type.remove.arg.input';
import { NotificationTypeUpdateArgInput } from '../dto/args/notification-type.update.arg.input';
import { NotificationTypePaginationResultInterface } from '../dto/interfaces/notification-type.pagination.result.interface';
import { NotificationTypeService } from '../service/notification-type.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { AllowPublic } from 'src/libs/auth/decorators/allow.public.decorator';
import { GraphqlWebsocketService } from 'src/libs/graphql/service/graphql.websocket.service';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class NotificationTypeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: NotificationTypeService,
        private readonly _gqlWsService: GraphqlWebsocketService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => NotificationTypeEntity, {
        name: 'findAllNotificationsTypes'
    })
    public async findAllNotificationsTypes(
        @Args('filter')
        filter: NotificationTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<NotificationTypePaginationResultInterface> {
        filter.targetLogin = user.sub;

        return this._service.findNotificationTypesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => NotificationTypeEntity, {
        name: 'findOneNotificationType',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<NotificationTypeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => NotificationTypeEntity, {
        name: 'createNotificationType'
    })
    public async create(
        @Args('data')
        data: NotificationTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<NotificationTypeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => NotificationTypeEntity, {
        name: 'updateNotificationType'
    })
    public async update(
        @Args('data')
        data: NotificationTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<NotificationTypeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => NotificationTypeEntity, {
        name: 'removeNotificationType'
    })
    public async remove(
        @Args('data')
        data: NotificationTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
