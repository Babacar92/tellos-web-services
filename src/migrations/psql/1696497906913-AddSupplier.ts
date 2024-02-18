import { TransactionnalMigration } from "@/libs/databases/decorators/classes/TransactionnalMigration";
import { MigrationInterface, QueryRunner } from "typeorm";

@TransactionnalMigration()
export class AddSupplier1696497906913 implements MigrationInterface {
    name = 'AddSupplier1696497906913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "FK_522a7796ab3864346048fcb8059"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "FK_9d96cd460dc062d4e9309aee245"`);
        await queryRunner.query(`CREATE TABLE "tellos_supplier_communication" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "supplier_id" integer NOT NULL, "phone" character varying, "fax" character varying, "email" character varying, "website" character varying, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_d552e91379ed7f57fcf91d9bbbb" UNIQUE ("supplier_id", "deleted_at"), CONSTRAINT "REL_d64c5ba47a3548279f42ff5903" UNIQUE ("supplier_id"), CONSTRAINT "PK_f7e98e25e3757ab539c2cc6f29f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tellos_supplier_contact" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "supplier_id" integer NOT NULL, "name" character varying, "service" character varying, "phone" character varying, "mobile_phone" character varying, "email" character varying, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_a4e216e17e4e93bfa3f7126f45e" UNIQUE ("email", "deleted_at"), CONSTRAINT "UQ_48d81e2e72cfac90c2ed7ea5467" UNIQUE ("mobile_phone", "deleted_at"), CONSTRAINT "PK_695fb823126b782d745a79ffd13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tellos_supplier_material_pricing" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "supplier_id" integer NOT NULL, "order_start_date" TIMESTAMP, "order_end_date" TIMESTAMP, "article_name" character varying, "article_number" character varying, "article_purchase_price" numeric DEFAULT '0', "article_discount_price" numeric DEFAULT '0', "article_net_price" numeric DEFAULT '0', "article_min_quantity" integer, "article_unit" integer, "framework_contrat" boolean, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_67b3de2ef1d09cdf6450cdef0cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tellos_supplier_material_pricing_entities_entity" ("supplier_material_pricing_id" integer NOT NULL, "entity_id" integer NOT NULL, CONSTRAINT "PK_d3826e72443e2bdfdf8ea8cbe24" PRIMARY KEY ("supplier_material_pricing_id", "entity_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d81bb399eb1481b9e6bf05b7c" ON "tellos_supplier_material_pricing_entities_entity" ("supplier_material_pricing_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b113833fbb047464d0c5945730" ON "tellos_supplier_material_pricing_entities_entity" ("entity_id") `);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_0b60ad419ea5c941d5d7df5aec6"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "vat"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "cp"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" ADD "active" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "zip_code" character varying`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "vat_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "active" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "siret"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "siret" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" ADD CONSTRAINT "UQ_702fb6fc7abb50c20daddbdeddb" UNIQUE ("code", "deleted_at")`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_26c31e229b09b4f46c74c075b1b" UNIQUE ("vat_id", "deleted_at")`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_334465ce9e0012518e61a69041b" UNIQUE ("siret", "deleted_at")`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "FK_522a7796ab3864346048fcb8059" FOREIGN KEY ("category_id") REFERENCES "tellos_supplier_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "FK_9d96cd460dc062d4e9309aee245" FOREIGN KEY ("language_code_id") REFERENCES "tellos_supplier_language_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_communication" ADD CONSTRAINT "FK_d64c5ba47a3548279f42ff59036" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_contact" ADD CONSTRAINT "FK_a8a8d109e395562cc64322e3f74" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_material_pricing" ADD CONSTRAINT "FK_15cc75f4fc04385083404aaaf1f" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_material_pricing_entities_entity" ADD CONSTRAINT "FK_1d81bb399eb1481b9e6bf05b7c0" FOREIGN KEY ("supplier_material_pricing_id") REFERENCES "tellos_supplier_material_pricing"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_material_pricing_entities_entity" ADD CONSTRAINT "FK_b113833fbb047464d0c59457308" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_supplier_material_pricing_entities_entity" DROP CONSTRAINT "FK_b113833fbb047464d0c59457308"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_material_pricing_entities_entity" DROP CONSTRAINT "FK_1d81bb399eb1481b9e6bf05b7c0"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_material_pricing" DROP CONSTRAINT "FK_15cc75f4fc04385083404aaaf1f"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_contact" DROP CONSTRAINT "FK_a8a8d109e395562cc64322e3f74"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_communication" DROP CONSTRAINT "FK_d64c5ba47a3548279f42ff59036"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "FK_9d96cd460dc062d4e9309aee245"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "FK_522a7796ab3864346048fcb8059"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_334465ce9e0012518e61a69041b"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_26c31e229b09b4f46c74c075b1b"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" DROP CONSTRAINT "UQ_702fb6fc7abb50c20daddbdeddb"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "siret"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "siret" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "vat_id"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_language_code" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "cp" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "vat" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "code" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_0b60ad419ea5c941d5d7df5aec6" UNIQUE ("code")`);
        await queryRunner.query(`DROP INDEX "tellos"."IDX_b113833fbb047464d0c5945730"`);
        await queryRunner.query(`DROP INDEX "tellos"."IDX_1d81bb399eb1481b9e6bf05b7c"`);
        await queryRunner.query(`DROP TABLE "tellos_supplier_material_pricing_entities_entity"`);
        await queryRunner.query(`DROP TABLE "tellos_supplier_material_pricing"`);
        await queryRunner.query(`DROP TABLE "tellos_supplier_contact"`);
        await queryRunner.query(`DROP TABLE "tellos_supplier_communication"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "FK_9d96cd460dc062d4e9309aee245" FOREIGN KEY ("language_code_id") REFERENCES "tellos_supplier_language_code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "FK_522a7796ab3864346048fcb8059" FOREIGN KEY ("category_id") REFERENCES "tellos_supplier_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
