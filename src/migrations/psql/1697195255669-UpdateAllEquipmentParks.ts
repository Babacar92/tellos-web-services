import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateAllEquipmentParks1697195255669
    implements MigrationInterface
{
    name = 'UpdateAllEquipmentParks1697195255669';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "t_svr_cession"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "t_svr_purchase"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "break_event"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "immobilizer_code"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "available" boolean NOT NULL DEFAULT true`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "original_value"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "original_value" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "counter"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "counter" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "standard_cost"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "standard_cost" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "co2_emission"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "co2_emission" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "monthly_rent"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "monthly_rent" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "maintenance_rent"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "maintenance_rent" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "buy_back_value"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "buy_back_value" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "immobilization_code"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "immobilization_code" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "geolocation_box_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "geolocation_box_number" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "UQ_733d4564efeee19b04dc08f0861" UNIQUE ("geolocation_box_number")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "geolocation_box_monthly_cost"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "geolocation_box_monthly_cost" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "total_card"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "total_card" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "UQ_be12a00d327d72825d70feb5d90" UNIQUE ("total_card")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "ango_pass"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "ango_pass" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "UQ_77b7462243cb53c192d310af195" UNIQUE ("ango_pass")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "chip_removed_and_returned" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "vehicle_empty" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "is_marking_removed" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "starts" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "rolling_vehicule" DROP NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "rolling_vehicule" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "starts" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "is_marking_removed" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "vehicle_empty" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "chip_removed_and_returned" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "UQ_77b7462243cb53c192d310af195"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "ango_pass"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "ango_pass" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "UQ_be12a00d327d72825d70feb5d90"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "total_card"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "total_card" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "geolocation_box_monthly_cost"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "geolocation_box_monthly_cost" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "UQ_733d4564efeee19b04dc08f0861"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "geolocation_box_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "geolocation_box_number" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "immobilization_code"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "immobilization_code" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "buy_back_value"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "buy_back_value" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "maintenance_rent"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "maintenance_rent" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "monthly_rent"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "monthly_rent" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "co2_emission"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "co2_emission" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "standard_cost"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "standard_cost" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "counter"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "counter" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "original_value"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "original_value" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "available"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "immobilizer_code" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "break_event" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "t_svr_purchase" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "t_svr_cession" integer`,
        );
    }
}
