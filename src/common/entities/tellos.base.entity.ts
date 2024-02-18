import { CreatedByColumn } from '@/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '@/libs/databases/decorators/columns/UpdatedByColumn';
import {
    Column,
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export class TellosBaseEntity {
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @CreatedByColumn()
    createdBy: string;
    @UpdatedByColumn()
    updatedBy: string;
}
