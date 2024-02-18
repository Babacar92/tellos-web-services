// NestJs
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';

//Librairies
import * as Dataloader from 'dataloader';

//Decorators

//Guards

//Schemas
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EquipmentParkDocument } from '../../../entities/psql/equipment-park-document.entity';

//Services
import { EquipmentParkDocumentService } from './equipment-park-document.service';

//DTOs
import { UpdateEquipmentParkDocumentInput } from './dtos/update-equipment-park-document.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkDocumentInput } from './dtos/create-equipment-park-document.input';
import { EquipmentParkDocumentFilterInput } from './dtos/equipment-park-document.filter.arg.input';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { DocumentTypeEntity } from '@/entities/psql/DocumentTypeEntity';
import { CurrentUser } from '@/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from '@/libs/auth/dto/interfaces/user.payload.interface';
import { LoginEntity } from '@/entities/psql/LoginEntity';
import { LoginUserPermissionGuard } from '@/modules/login/guards/login.user.permission.guard';
import { UseGuards } from '@nestjs/common';
import { UploadEntity } from '@/entities/psql/UploadEntity';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => EquipmentParkDocument)
export class EquipmentParkDocumentResolver {
    constructor(
        private equipmentParkDocumentService: EquipmentParkDocumentService,
    ) {}

    @Query((returns) => PaginatedResult<EquipmentParkDocument>, {
        name: 'findAllPaginatedEquipmentParkDocuments',
    })
    async findAll(
        @Args('filter') filter: EquipmentParkDocumentFilterInput,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkDocument>> {
        return this.equipmentParkDocumentService.findAll(
            filter,
            sort,
            pagination,
        );
    }

    @Query((returns) => EquipmentParkDocument, {
        name: 'findOneEquipmentParkDocuments',
    })
    async findOne(@Args('id') id: number): Promise<EquipmentParkDocument> {
        return this.equipmentParkDocumentService.findOne(id);
    }

    @Mutation((returns) => EquipmentParkDocument, {
        name: 'createEquipmentParkDocument',
    })
    async create(
        @Args('data') data: CreateEquipmentParkDocumentInput,
        @CurrentUser() user: UserPayloadInterface
    ): Promise<EquipmentParkDocument> {
        data.user = LoginEntity.init(user.sub);

        return this.equipmentParkDocumentService.create(data);
    }

    @Mutation((returns) => EquipmentParkDocument, {
        name: 'updateEquipmentParkDocument',
    })
    async update(
        @Args('data') data: UpdateEquipmentParkDocumentInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentParkDocument> {
        data.user = LoginEntity.init(user.sub);
        return this.equipmentParkDocumentService.update(data);
    }

    @ResolveField('user', (returns) => Employee)
    async user(
        @Parent() parent: EquipmentParkDocument,
        @Context('loginLoader')
        loginLoader: Dataloader<number, LoginEntity>,
    ): Promise<Employee> {
        return parent.user_id ? loginLoader.load(parent.user_id) : null;
    }

    @ResolveField('file', (returns) => UploadEntity)
    async file(
        @Parent() parent: EquipmentParkDocument,
        @Context('equipmentParkDocumentUploadLoader')
        equipmentParkDocumentUploadLoader: Dataloader<number, UploadEntity>,
    ): Promise<UploadEntity> {
        return parent.id ? equipmentParkDocumentUploadLoader.load(parent.id) : null;
    }

    @ResolveField('equipmentPark', (returns) => EquipmentPark)
    async equipmentPark(
        @Parent() parent: EquipmentParkDocument,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, EquipmentPark>,
    ): Promise<EquipmentPark> {
        return parent.equipment_park_id
            ? equipmentParkLoader.load(parent.equipment_park_id)
            : null;
    }

    @ResolveField('type', (returns) => DocumentTypeEntity)
    async type(
        @Parent() parent: EquipmentParkDocument,
        @Context('documentTypeLoader')
        documentTypeLoader: Dataloader<number, DocumentTypeEntity>,
    ): Promise<DocumentTypeEntity> {
        return parent.type_id ? documentTypeLoader.load(parent.type_id) : null;
    }

    @Mutation((returns) => Boolean, {
        name: 'deleteEquipmentParkDocument',
    })
    delete(@Args('id') id: number) {
        return this.equipmentParkDocumentService.delete(id);
    }
}
