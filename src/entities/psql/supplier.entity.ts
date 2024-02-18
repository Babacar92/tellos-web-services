//NestJs
import { Field, Int, Float, ObjectType } from '@nestjs/graphql';

//TypeOrm
import { Column, Entity, ManyToOne, Unique, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

//BaseEntity
import { BaseEntity } from '@/common/entities/base.entity';

//Entities
import { SupplierCategoryEntity } from '@Entities/SupplierCategoryEntity';
import { SupplierLanguageCodeEntity } from '@/entities/psql/SupplierLanguageCodeEntity';

//Class Validator
import { IsString, IsNumber, IsUrl } from 'class-validator';

@ObjectType('Supplier')
@Unique(['siret', 'deletedAt'])
@Unique(['vat', 'deletedAt'])
@Unique(['name', 'deletedAt'])
@Entity({
    name: 'supplier',
})
export class Supplier extends BaseEntity {
    public constructor(data?: Partial<Supplier>) {
        super();
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @IsString()
    @Field()
    name?: string;

    @Column({ nullable: true })
    @IsString()
    @Field({ nullable: true })
    address?: string;

    @Column({ nullable: true, name: 'address_bis' })
    @IsString()
    @Field({ nullable: true })
    addressBis?: string;

    @Column({ nullable: true, name: 'zip_code' })
    @IsNumber()
    @Field(() => String, { nullable: true })
    zipCode?: string;

    @Column({ nullable: true })
    @IsString()
    @Field({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    @IsString()
    @Field({ nullable: true })
    country?: string;

    @ManyToOne(() => SupplierCategoryEntity, (category) => category.id)
    @JoinColumn({ name: 'category_id' })
    @Field(() => SupplierCategoryEntity, { nullable: true })
    category?: SupplierCategoryEntity;

    @Column({ nullable: true, name: 'category_id' })
    category_id?: number;

    @ManyToOne(
        () => SupplierLanguageCodeEntity,
        (language_code) => language_code.id,
    )
    @JoinColumn({ name: 'language_code_id' })
    @Field(() => SupplierLanguageCodeEntity, { nullable: true })
    languageCode?: SupplierLanguageCodeEntity;

    @Column({ nullable: true, name: 'language_code_id' })
    language_code_id?: number;

    @Column({ nullable: true })
    @IsString()
    @Field({ nullable: true })
    observation?: string;

    @Column({ nullable: true })
    @IsNumber()
    @Field(() => String, { nullable: true })
    phone?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    @IsString()
    email?: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    @IsUrl()
    website?: string;

    @Column({ nullable: true })
    @IsNumber()
    @Field(() => String, { nullable: true })
    fax?: string;

    @Column()
    @IsNumber()
    @Field(() => String)
    siret!: string;

    @Column()
    @IsNumber()
    @Field(() => String)
    ape!: string;

    @Column()
    @IsNumber()
    @Field(() => String)
    vat!: string;

    @Column({ nullable: true, name: 'authorized_out_standing' })
    @IsNumber()
    @Field(() => Int, { nullable: true })
    authorizedOutStanding?: number;

    @Column({ nullable: true, name: 'client_name' })
    @IsString()
    @Field({ nullable: true })
    clientName?: string;

    @Field({ nullable: true })
    @Column({
        type: 'boolean',
        default: true,
    })
    public active?: boolean;

    public static isColumnString(value: string): boolean {
        return !!value.match(/^(name|address|addressBis|zipCode|city|country|observation|phone|email|website|fax|siret|ape|vat|clientName|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): Supplier {
        return id ? new Supplier({ id: id }) : null;
    }
}
