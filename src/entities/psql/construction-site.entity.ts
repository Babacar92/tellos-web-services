import { BaseEntity } from '@/common/entities/base.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityEntity } from './EntityEntity';
import { Employee } from './EmployeeEntity';
import { ConstructionSiteTypeEnum } from '@/modules/construction-site/enums/construction-site-type.enum';
import { ConstructionSiteStatusEnum } from '@/modules/construction-site/enums/construction-site-status.enum';

@ObjectType()
@Entity('construction_site')
export class ConstructionSite extends BaseEntity {
    constructor(data: Partial<ConstructionSite>) {
        super();
        Object.assign(this, data);
    }
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @Column()
    @Field()
    code!: string;

    @Column({ type: 'enum', enum: ConstructionSiteTypeEnum })
    @Field((type) => ConstructionSiteTypeEnum)
    type!: ConstructionSiteTypeEnum;

    @OneToOne(
        () => ConstructionSite,
        (constructionSite) => constructionSite.id,
        { nullable: true },
    )
    @JoinColumn()
    @Field((type) => ConstructionSite, { nullable: true })
    from?: ConstructionSite;

    @Column({ nullable: true })
    from_id: number;

    @Column()
    @Field()
    label: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    place?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    nature?: string;

    @ManyToOne(() => EntityEntity, (entity) => entity.id, { nullable: true })
    @JoinColumn()
    @Field(() => EntityEntity, { nullable: true })
    entity?: EntityEntity;

    @Column()
    entity_id?: number;

    // institution?: unknown;
    // businessManager?: unknown;
    // driver?: unknown;

    // activity?: unknown;
    // zone?: unknown;

    @Column({ type: 'boolean', default: true, nullable: true })
    @Field({ nullable: true, defaultValue: true })
    submittedToGeneralFees?: boolean;

    @Column({ type: 'boolean', default: true, nullable: true })
    @Field({ nullable: true, defaultValue: true })
    constructionForecast?: boolean;

    @Column({ nullable: true })
    @Field((type) => Int, { nullable: true })
    commands?: number;

    @Column({ nullable: true })
    @Field((type) => Int, { nullable: true })
    incomes?: number;

    @Column({ nullable: true })
    @Field((type) => Int, { nullable: true })
    expenses?: number;

    @Column({ nullable: true })
    @Field((type) => Int, { nullable: true })
    billings?: number;

    @Column({ type: 'date', nullable: true })
    @Field({ nullable: true })
    openingCaseDate?: Date;

    @Column({ type: 'date', nullable: true })
    @Field({ nullable: true })
    startDate?: Date;

    @Column({ type: 'date', nullable: true })
    @Field({ nullable: true })
    endDate?: Date;

    @Column({ type: 'date', nullable: true })
    @Field({ nullable: true })
    ClosingDate?: Date;

    @Column({ type: 'enum', enum: ConstructionSiteStatusEnum, nullable: true })
    @Field((type) => ConstructionSiteStatusEnum, { nullable: true })
    status?: ConstructionSiteStatusEnum;

    // TODO: ADD LIFE SHEET

    // TODO: ADD PV work receiption
    @Column({ nullable: true })
    @Field({ nullable: true })
    dictDate?: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    dictReference?: string;

    // @Column({ nullable: true })
    // @Field({ nullable: true })
    // dictFiles?: unknown[];

    @Column({ nullable: true })
    @Field({ nullable: true })
    circulationDate?: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    circulationRef?: string;

    // @Column({ nullable: true })
    // @Field({ nullable: true })
    // circulationFiles?: unknown[];

    @ManyToOne(() => Employee, (employee) => employee.id, { nullable: true })
    @Field((type) => Employee, { nullable: true })
    @JoinColumn()
    riskFrom?: Employee;

    @Column({ nullable: true })
    risk_from_id?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    riskComment?: string;

    // @Column({ nullable: true })
    // @Field({ nullable: true })
    // riskFiles?: unknown[];

    static init(id: number): ConstructionSite {
        return new ConstructionSite({ id });
    }

    public static isColumnString(value: string): boolean {
        return !!value.match(/^(label|place|nature|createdBy|updatedBy)$/i);
    }
}
