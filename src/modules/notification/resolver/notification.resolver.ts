import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationEntity } from 'src/entities/psql/NotificationEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { NotificationFilterArgInput } from '../dto/args/notification.filter.arg.input';
import { NotificationPaginationResultInterface } from '../dto/interfaces/notification.pagination.result.interface';
import { NotificationService } from '../service/notification.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { GraphqlWebsocketService } from 'src/libs/graphql/service/graphql.websocket.service';
import { AllowPublic } from 'src/libs/auth/decorators/allow.public.decorator';
import { dump } from 'src/utils/utils';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class NotificationResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: NotificationService,
        private readonly _gqlWsService: GraphqlWebsocketService,
    ) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => NotificationEntity, {
        name: 'findAllNotifications',
    })
    public async findAllNotificationsTypes(
        @Args('filter')
        filter: NotificationFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<NotificationPaginationResultInterface> {
        return this._service.findNotificationsAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => NotificationEntity, {
        name: 'findOneNotification',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<NotificationEntity> {
        return this._service.findOne(id);
    }

    /**
     *
     * @param notificationType
     * @param user
     * @returns
     */
    @Mutation(() => NotificationEntity, {
        name: 'markAllNotificationsAsRead',
    })
    public async markAllNotificationsAsRead(
        @Args('notificationType')
        notificationType: number,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<boolean> {
        return this._service.markAllNotificationsAsRead(
            user.sub,
            notificationType,
        );
    }

    /**
     *
     * @param notificationId
     * @param user
     * @returns
     */
    @Mutation(() => NotificationEntity, {
        name: 'markNotificationAsRead',
    })
    public async markNotificationAsRead(
        @Args('notificationId')
        notificationId: number,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<boolean> {
        return this._service.markNotificationAsRead(user.sub, notificationId);
    }

    /**
     *
     * @returns
     */
    @AllowPublic()
    @Subscription('getCountNotification', {
        filter(payload, variables, context) {
            return payload.userId === variables.userId;
        },
    })
    public async getCountNotification(
        @Args('userId')
        userId: number,
    ) {
        this._service.returnTotal(userId);
        return this._gqlWsService.asyncIterator('getCountNotification');
    }
}
