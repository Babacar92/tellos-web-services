import { SupplierNoteEntity } from '@/entities/psql/supplier-note.entity';
import { ResultPaginationInterface } from '../../../../../libs/databases/dto/interfaces/result.pagination.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SupplierNotesResponse {
    @Field((type) => [SupplierNoteEntity])
    result: SupplierNoteEntity[];

    @Field((type) => ResultPaginationInterface)
    pagination: ResultPaginationInterface;
}
