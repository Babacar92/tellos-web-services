import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class MigrationVersion0021689326984411 implements MigrationInterface {
    name = 'MigrationVersion0021689326984411';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" DROP CONSTRAINT "FK_45f0d3363a6ee7dd856184a9574"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" RENAME COLUMN "regulation_code" TO "regulation_code_id"`,
        );
        await queryRunner.query(
            `ALTER TYPE "tellos"."tellos_customer_regulation_code_enum" RENAME TO "tellos_customer_regulation_code_id_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_leave_distribution_name_enum" AS ENUM('PAID_LEAVE', 'UNPAID_ABSENCE', 'RECOVERY', 'SICK_LEAVE', 'STOP_WORK_ACCIDENT', 'ANNOUNCEMENT_OF_A_DISABILITY_IN_A_CHILD', 'BEREAVEMENT_LEAVE_FOR_A_CHILD', 'SICK_CHILD', 'WEDDING', 'CHILD_WEDDIND', 'BIRTH_ADOPTION', 'ADOPTION', 'In_LAWS_FUNERAL', 'SPOUSE_FUNERAL', 'CHILD_FUNERAL', 'BROTHER_FUNERAL', 'SISTER_FUNERAL', 'PARENTS_FUNERAL')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_leave_distribution" ("id" SERIAL NOT NULL, "name" "tellos"."tellos_leave_distribution_name_enum", "total" numeric, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "leave_id" integer, CONSTRAINT "PK_9d2bb16b7de4b4f01fa3cc62ee7" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_leave_period" ("id" SERIAL NOT NULL, "date_from" date, "date_to" date, "count_acquired_leave" numeric, "count_usable_leave" numeric, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "employee_id" integer, CONSTRAINT "PK_dc23de6c998cd883f0064a5a733" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_medical_visists_contract_enum" AS ENUM('CDI', 'CDD', 'Interim', 'Contrat pro', 'Stage', 'Alternant', 'Renew')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_medical_visists_statut_enum" AS ENUM('POSITIVE', 'NEGATIVE', 'PENDING')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_medical_visists" ("id" SERIAL NOT NULL, "contract" "tellos"."tellos_medical_visists_contract_enum", "statut" "tellos"."tellos_medical_visists_statut_enum", "start_date" date, "end_date" date, "last_date_medical_visit" date, "next_date_medical_visit" date, "place_of_the_medicalvisit" character varying, "contraindication" text, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "entity_id" integer, "service_id" integer, "employee_id" integer, "file_id" integer, CONSTRAINT "PK_b90ef04900faff524553f2929fd" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_payment_mode" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_103554d7c3d847dfa235b650eb5" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_payment_type" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_e1088c0a7c5bf4c9feb2889026d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_tender_type" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_495d65f77037f05edbd736d8366" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_market_type" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_84c87e5bdbd546c898e02cb8cdd" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_batch_status" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_052d415e15e2212c297e4d8c128" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_batch" ("id" SERIAL NOT NULL, "label" character varying, "apology" text, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "business_id" integer, "status_id" integer, "commercial_id" integer, CONSTRAINT "PK_8d3eeaf85016a3ded017a0807cb" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_document_classification" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_09ac8c8a80ab50952afca74257a" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_document_type" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_86682a7055424dbf9173c6fbcd3" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_cocument" ("id" SERIAL NOT NULL, "label" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "business_id" integer, "type_id" integer, "classification_id" integer, "login_id" integer, "file_id" integer, CONSTRAINT "PK_841330569dd12ffa7a99c2c0e30" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business_budget" ("id" SERIAL NOT NULL, "work" character varying, "ht_price" numeric(20,2), "margin" numeric(20,2), "ht_margin" numeric(20,2), "ht_total" numeric(20,2), "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "entity_id" integer, "business_id" integer, CONSTRAINT "PK_61a97134ffec3a6cbb3e45c05c7" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_business_unit_enum" AS ENUM('DAY', 'WEEK', 'MONTH', 'YEAR')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_business_type_enum" AS ENUM('SIMPLIFIED', 'MARKET')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_business_status_enum" AS ENUM('IN_PROGRESS', 'WIN', 'LOST')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_business" ("id" SERIAL NOT NULL, "email" character varying(255), "code" character varying, "label" character varying, "external_code" character varying, "paying_owner" character varying, "main_owner" character varying, "under_cover" boolean DEFAULT false, "owner" character varying, "origin" character varying, "estimated_amount" numeric(14,2), "reference_case" character varying, "bid_bond" boolean DEFAULT false, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "start_date_study" TIMESTAMP, "end_date_study" TIMESTAMP, "work_duration" integer, "unit" "tellos"."tellos_business_unit_enum", "type" "tellos"."tellos_business_type_enum", "status" "tellos"."tellos_business_status_enum", "abandoned_at" TIMESTAMP, "application_date" TIMESTAMP, "retrieve_date" TIMESTAMP, "limite_date" TIMESTAMP, "deposit_date" TIMESTAMP, "agency" character varying, "address" character varying, "postal_code" character varying, "city" character varying, "country" character varying, "phone" character varying, "website" character varying, "gps" character varying, "delegated_customer" character varying, "economist" character varying, "engineering_office" character varying, "fuild_engineering_office" character varying, "ground_engineering_office" character varying, "control_office" character varying, "pilot" character varying, "safety_coordinator" character varying, "is_editable" boolean, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "customer_id" integer, "payment_mode_id" integer, "payment_type_id" integer, "tender_type_id" integer, "market_type_id" integer, "works_chief_id" integer, "works_manager_id" integer, "main_site_manager_id" integer, "site_manager2_id" integer, "site_manager3_id" integer, "commercial_id" integer, "picture_id" integer, CONSTRAINT "PK_95a2be2e06dfd09595f79bfc050" PRIMARY KEY ("id")); COMMENT ON COLUMN "tellos_business"."email" IS 'Encryption value for field email'`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_regulation_code" ("id" SERIAL NOT NULL, "code" character varying, "title" character varying, "immediate_days" integer, "specificity" boolean, "payment_days" integer, "additionnal_days" integer, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_99b883df3dfee15f89fc0d027e0" UNIQUE ("title", "deleted_at"), CONSTRAINT "UQ_ff4370f1331b03dad830825e97c" UNIQUE ("code", "deleted_at"), CONSTRAINT "PK_40f8492c42c0a668bf3af14d785" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_login_permission" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "login_id" integer, "entity_id" integer, "permission_id" integer, CONSTRAINT "PK_a60d264d2643004f2adbb498c62" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_employee_disciplinary" ("id" SERIAL NOT NULL, "comment" text, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "employee_id" integer, CONSTRAINT "PK_273d8053e9e0ed717bef0813966" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract_type_entry" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_df25aa37d8074b4dc60a97c351c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract_type_payment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_69f482d338d7866ca17550b6a92" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract_apprentice" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_d8422fd159236e21510bd45d773" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract_section" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_c5cf9ac3c845d0cbd289afcd6d8" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract_level" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_3cd5d07ad85c41d05bfb4d48c1a" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_job_description" ("id" SERIAL NOT NULL, "number" character varying, "title" text, "description" text, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "entity_id" integer, "department_id" integer, CONSTRAINT "PK_822cca7abea1d8eb86b7128a543" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_contract_info_type_contract_enum" AS ENUM('CDI', 'CDD', 'Interim', 'Contrat pro', 'Stage', 'Alternant', 'Renew')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_contract_info_renewal_enum" AS ENUM('YES', 'NO')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_contract_info_leaving_raison_enum" AS ENUM('MUTUAL_AGREEMENT', 'RETIREMENT', 'RESIGNATION', 'DISMISSAL')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_contract_info_category_enum" AS ENUM('FRAME', 'WORKER', 'APPRENTICE', 'ETAM')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_contract_info_age_category_enum" AS ENUM('UNDER_18_YEARS_OLD', '18_TO_25_YEARS_OLD', '26_TO_35_YEARS_OLD', '36_TO_45_YEARS_OLD', '46_TO_55_YEARS_OLD', '55_YEARS_AND_OVER')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract_info" ("id" SERIAL NOT NULL, "type_contract" "tellos"."tellos_contract_info_type_contract_enum", "entry_date" date, "seniority_date" date, "sage_pay_code" character varying, "end_trial_period" date, "renewal" "tellos"."tellos_contract_info_renewal_enum", "end_renewal" date, "end_contract_cdd" date, "amendment_cdd" date, "departure_date" date, "leaving_raison" "tellos"."tellos_contract_info_leaving_raison_enum", "job" text, "category" "tellos"."tellos_contract_info_category_enum", "code" character varying, "position" character varying, "coefficient" character varying, "large_rate_dep" character varying, "age_category" "tellos"."tellos_contract_info_age_category_enum", "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "employee_id" integer, "type_entry_id" integer, "type_payment_id" integer, "apprentice_id" integer, "section_id" integer, "level_id" integer, "job_description_id" integer, CONSTRAINT "REL_fbc34ff9e3a808d7b5b07d9dc1" UNIQUE ("employee_id"), CONSTRAINT "PK_6861053cb0070eb8358ebe1af07" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract_comment" ("id" SERIAL NOT NULL, "comment" text, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "employee_id" integer, "contract_id" integer, CONSTRAINT "PK_18cee9e41dda59a5cca86133666" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_contract_status_enum" AS ENUM('GREEN', 'RED', 'GRAY')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_contract_type_enum" AS ENUM('CDI', 'CDD', 'Interim', 'Contrat pro', 'Stage', 'Alternant', 'Renew')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_contract" ("id" SERIAL NOT NULL, "filename" character varying, "text" text, "status" "tellos"."tellos_contract_status_enum", "type" "tellos"."tellos_contract_type_enum", "is_signed" boolean, "you_sign_document_id" character varying, "you_sign_signature_request_id" character varying, "you_sign_target_user_to_sign_id" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "employee_id" integer, CONSTRAINT "PK_0d08032847de9b4a307dd823621" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_admin_document" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "file_id" integer, "category_id" integer, CONSTRAINT "PK_6254e682f347413c7b0c994a35d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_medium_size_centre" ("id" SERIAL NOT NULL, "code" character varying, "label" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_2eaef92f66e91196f821ba7234c" UNIQUE ("code"), CONSTRAINT "PK_e438e5201e50264c0524a6d9873" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_work_entity" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_58dc9ac2d7470a3c717395f8be0" UNIQUE ("title", "deleted_at"), CONSTRAINT "PK_cb98a389d6a5aedbf1812df05c9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_category_equipment" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "title" character varying, "cost_price" numeric(20,2), "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "work_unit_id" integer, "medium_sized_centre_id" integer, CONSTRAINT "PK_44fb04d70c78c2a184209dccc87" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_purchase_account" ("id" SERIAL NOT NULL, "account" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "section_code_id" integer, CONSTRAINT "PK_47babeb8ae605a583b9ffded448" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_section_code" ("id" SERIAL NOT NULL, "code" character varying, "designation" character varying, "inventory_change_account" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "expense_post_id" integer, CONSTRAINT "UQ_ae4f9b6b3ba8d11b4752b81fbb5" UNIQUE ("code", "deleted_at"), CONSTRAINT "PK_7655b508c19b6a0997b74e92533" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_expense_post" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_bc26cbd91001de8a6dd1aed4df9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_medical_visit_job" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_24ee4a752d30f51488654705131" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_employee_disciplinary_files_upload" ("employee_disciplinary_id" integer NOT NULL, "upload_id" integer NOT NULL, CONSTRAINT "PK_b3aaab98fa81865477c011caa2f" PRIMARY KEY ("employee_disciplinary_id", "upload_id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_43113d0d61863cf074688e24df" ON "tellos_employee_disciplinary_files_upload" ("employee_disciplinary_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_e315c22962c0083c4ffda08293" ON "tellos_employee_disciplinary_files_upload" ("upload_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "request_date"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "type"`,
        );
        await queryRunner.query(`DROP TYPE "tellos"."tellos_leave_type_enum"`);
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "entity"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_leave_entity_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" DROP CONSTRAINT "REL_45f0d3363a6ee7dd856184a957"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" DROP COLUMN "employee_contract_id"`,
        );
        await queryRunner.query(`ALTER TABLE "tellos_leave" ADD "motive" text`);
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_leave_start_day_enum" AS ENUM('startAllDay', 'startHalfAmDay', 'startHalfPmDay')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD "start_day" "tellos"."tellos_leave_start_day_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_leave_end_day_enum" AS ENUM('endAllDay', 'endHalfDay')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD "end_day" "tellos"."tellos_leave_end_day_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD "entity_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD "leave_period_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_career_path" ADD "medical_visit_id" integer`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_entity_type_enum" AS ENUM('GROUPE TELLOS', 'CIBTP')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_entity" ADD "type" "tellos"."tellos_entity_type_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_entity" ADD "membership_number" character varying`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_qualification_status_enum" AS ENUM('VALIDATED', 'REFUSED', 'WAITING_VALIDATION')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_qualification" ADD "status" "tellos"."tellos_qualification_status_enum" DEFAULT 'VALIDATED'`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_qualification" ADD "from_my_account" boolean`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login" ADD "firstname" character varying(255)`,
        );
        await queryRunner.query(
            `COMMENT ON COLUMN "tellos_login"."firstname" IS 'Encryption value for field firstname'`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login" ADD "lastname" character varying(255)`,
        );
        await queryRunner.query(
            `COMMENT ON COLUMN "tellos_login"."lastname" IS 'Encryption value for field lastname'`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login" ADD "is_external" boolean DEFAULT false`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_employee_type_enum" AS ENUM('EMPLOYEE_TYPE_EMPLOYEE', 'EMPLOYEE_TYPE_INTERIM', 'EMPLOYEE_TYPE_CANDIDATE')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" ADD "type" "tellos"."tellos_employee_type_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" ADD "contract_info_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" ADD CONSTRAINT "UQ_442589cd383daf886550f0e35d1" UNIQUE ("contract_info_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ALTER COLUMN "start_date" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ALTER COLUMN "end_date" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" DROP COLUMN "regulation_code_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" ADD "regulation_code_id" integer`,
        );
        await queryRunner.query(
            `ALTER TYPE "tellos"."tellos_employee_document_status_enum" RENAME TO "tellos_employee_document_status_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_employee_document_status_enum" AS ENUM('STATUS_UPLOADED_FOR_EMPLOYEE', 'STATUS_WAITING_FILE', 'STATUS_WAITING_SIGNATURE', 'STATUS_SIGNED', 'STATUS_NOT_SIGNED', 'STATUS_REFUSED', 'STATUS_ACCEPTED', 'STATUS_TRANSMITTED', 'STATUS_SIGNATURE_IN_PROGRESS')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_document" ALTER COLUMN "status" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_document" ALTER COLUMN "status" TYPE "tellos"."tellos_employee_document_status_enum" USING "status"::"text"::"tellos"."tellos_employee_document_status_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_document" ALTER COLUMN "status" SET DEFAULT 'STATUS_UPLOADED_FOR_EMPLOYEE'`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_employee_document_status_enum_old"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave_distribution" ADD CONSTRAINT "FK_06fda3411b977c3d0a5109d1c96" FOREIGN KEY ("leave_id") REFERENCES "tellos_leave"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave_period" ADD CONSTRAINT "FK_513169cd06475518e3fff1e3a71" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD CONSTRAINT "FK_39dd0b1aecd66ca4269cd066a06" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD CONSTRAINT "FK_a59f87e9a17652e71a063cb59b8" FOREIGN KEY ("leave_period_id") REFERENCES "tellos_leave_period"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_career_path" ADD CONSTRAINT "FK_1349edadf3c94077fea13785456" FOREIGN KEY ("medical_visit_id") REFERENCES "tellos_medical_visists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" ADD CONSTRAINT "FK_f44c8a8a03e2f3b5bd391fbe681" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" ADD CONSTRAINT "FK_9a23106693b266ba869fef6b807" FOREIGN KEY ("service_id") REFERENCES "tellos_department"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" ADD CONSTRAINT "FK_5aa92df7c6e5303d7010c8e0318" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" ADD CONSTRAINT "FK_e8bd36476d0e45f1b1c3148a6db" FOREIGN KEY ("file_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_batch" ADD CONSTRAINT "FK_1fb6ad101687241d7be03bb1a22" FOREIGN KEY ("business_id") REFERENCES "tellos_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_batch" ADD CONSTRAINT "FK_052d415e15e2212c297e4d8c128" FOREIGN KEY ("status_id") REFERENCES "tellos_business_batch_status"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_batch" ADD CONSTRAINT "FK_2707c5d58423776b025d797f6a1" FOREIGN KEY ("commercial_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" ADD CONSTRAINT "FK_4d40fadadd60a4536f8441f63fa" FOREIGN KEY ("business_id") REFERENCES "tellos_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" ADD CONSTRAINT "FK_d47da843de873974322a05d74fe" FOREIGN KEY ("type_id") REFERENCES "tellos_business_document_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" ADD CONSTRAINT "FK_e05d3b1e6402c058d349ce72f51" FOREIGN KEY ("classification_id") REFERENCES "tellos_business_document_classification"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" ADD CONSTRAINT "FK_17d46d6c630af32d4b409292033" FOREIGN KEY ("login_id") REFERENCES "tellos_login"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" ADD CONSTRAINT "FK_2801f86a53964a043a98fd1ccf0" FOREIGN KEY ("file_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_budget" ADD CONSTRAINT "FK_e0e851c48096a5b0dec8890cd41" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_budget" ADD CONSTRAINT "FK_290fae4d94d1ad1e362e4b80ef4" FOREIGN KEY ("business_id") REFERENCES "tellos_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_3610d70280a6aff762ec3136730" FOREIGN KEY ("customer_id") REFERENCES "tellos_customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_103554d7c3d847dfa235b650eb5" FOREIGN KEY ("payment_mode_id") REFERENCES "tellos_business_payment_mode"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_e1088c0a7c5bf4c9feb2889026d" FOREIGN KEY ("payment_type_id") REFERENCES "tellos_business_payment_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_495d65f77037f05edbd736d8366" FOREIGN KEY ("tender_type_id") REFERENCES "tellos_business_tender_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_84c87e5bdbd546c898e02cb8cdd" FOREIGN KEY ("market_type_id") REFERENCES "tellos_business_market_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_71b366c09d68c7738158059b4fd" FOREIGN KEY ("works_chief_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_116c817ea16520a6eeaebf1dc5c" FOREIGN KEY ("works_manager_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_afbe58badd3cd0d27337dd1c9e8" FOREIGN KEY ("main_site_manager_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_70b18de017f28beccd56938c869" FOREIGN KEY ("site_manager2_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_1b12a3fe9011a0137c1edaf3dd8" FOREIGN KEY ("site_manager3_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_5aa8df6a548bebb12acd4684177" FOREIGN KEY ("commercial_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" ADD CONSTRAINT "FK_d82bb2b9bc944d4d0253ec41b10" FOREIGN KEY ("picture_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" ADD CONSTRAINT "FK_3319d80bd5c6827c00a7d6a0c42" FOREIGN KEY ("regulation_code_id") REFERENCES "tellos_regulation_code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login_permission" ADD CONSTRAINT "FK_fe4f6638cb97a3fa6efda74dc1d" FOREIGN KEY ("login_id") REFERENCES "tellos_login"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login_permission" ADD CONSTRAINT "FK_819b96449e4271cc6ed7c6244f7" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login_permission" ADD CONSTRAINT "FK_7465fd05255c93c752440fc2493" FOREIGN KEY ("permission_id") REFERENCES "tellos_permission"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_disciplinary" ADD CONSTRAINT "FK_71e72aa0ed080fa848ec63b5a74" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_job_description" ADD CONSTRAINT "FK_cea8859c9592dbc54546167c58a" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_job_description" ADD CONSTRAINT "FK_879a5980e67f1555958b82fe514" FOREIGN KEY ("department_id") REFERENCES "tellos_department"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" ADD CONSTRAINT "FK_fbc34ff9e3a808d7b5b07d9dc19" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" ADD CONSTRAINT "FK_fc34d2bba907a97ce2229aa74c8" FOREIGN KEY ("type_entry_id") REFERENCES "tellos_contract_type_entry"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" ADD CONSTRAINT "FK_207b110b3aa39b937b0d3ef0afe" FOREIGN KEY ("type_payment_id") REFERENCES "tellos_contract_type_payment"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" ADD CONSTRAINT "FK_2149d04cb57f16a282e0f53dbbf" FOREIGN KEY ("apprentice_id") REFERENCES "tellos_contract_apprentice"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" ADD CONSTRAINT "FK_fba615191ab28354046a9b76a7d" FOREIGN KEY ("section_id") REFERENCES "tellos_contract_section"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" ADD CONSTRAINT "FK_742b1a4cf3974e8019f21d4b02a" FOREIGN KEY ("level_id") REFERENCES "tellos_contract_level"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" ADD CONSTRAINT "FK_c38b9abbe5e829fd7a45b4343be" FOREIGN KEY ("job_description_id") REFERENCES "tellos_job_description"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_comment" ADD CONSTRAINT "FK_600bc9107002bfddd0e0d502a1c" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_comment" ADD CONSTRAINT "FK_857985534348723fb4949fe0f53" FOREIGN KEY ("contract_id") REFERENCES "tellos_contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract" ADD CONSTRAINT "FK_9b05139a1aeeeb5744c3475f256" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" ADD CONSTRAINT "FK_442589cd383daf886550f0e35d1" FOREIGN KEY ("contract_info_id") REFERENCES "tellos_contract_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_admin_document" ADD CONSTRAINT "FK_628a5e15b83c72f96498926ecf7" FOREIGN KEY ("file_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_admin_document" ADD CONSTRAINT "FK_564e79aaceb3230a5e1d70f627f" FOREIGN KEY ("category_id") REFERENCES "tellos_document_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" ADD CONSTRAINT "FK_0c241c87cca241260fed8e2b7e0" FOREIGN KEY ("work_unit_id") REFERENCES "tellos_work_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" ADD CONSTRAINT "FK_d96f6be85acc1d0e7b0877fd416" FOREIGN KEY ("medium_sized_centre_id") REFERENCES "tellos_medium_size_centre"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_purchase_account" ADD CONSTRAINT "FK_7ccaf7e016cc0202f11026987ab" FOREIGN KEY ("section_code_id") REFERENCES "tellos_section_code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_section_code" ADD CONSTRAINT "FK_e3162f1b6ef2cce4521de524cc1" FOREIGN KEY ("expense_post_id") REFERENCES "tellos_expense_post"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_disciplinary_files_upload" ADD CONSTRAINT "FK_43113d0d61863cf074688e24df8" FOREIGN KEY ("employee_disciplinary_id") REFERENCES "tellos_employee_disciplinary"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_disciplinary_files_upload" ADD CONSTRAINT "FK_e315c22962c0083c4ffda08293a" FOREIGN KEY ("upload_id") REFERENCES "tellos_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_disciplinary_files_upload" DROP CONSTRAINT "FK_e315c22962c0083c4ffda08293a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_disciplinary_files_upload" DROP CONSTRAINT "FK_43113d0d61863cf074688e24df8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_section_code" DROP CONSTRAINT "FK_e3162f1b6ef2cce4521de524cc1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_purchase_account" DROP CONSTRAINT "FK_7ccaf7e016cc0202f11026987ab"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" DROP CONSTRAINT "FK_d96f6be85acc1d0e7b0877fd416"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" DROP CONSTRAINT "FK_0c241c87cca241260fed8e2b7e0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_admin_document" DROP CONSTRAINT "FK_564e79aaceb3230a5e1d70f627f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_admin_document" DROP CONSTRAINT "FK_628a5e15b83c72f96498926ecf7"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" DROP CONSTRAINT "FK_442589cd383daf886550f0e35d1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract" DROP CONSTRAINT "FK_9b05139a1aeeeb5744c3475f256"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_comment" DROP CONSTRAINT "FK_857985534348723fb4949fe0f53"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_comment" DROP CONSTRAINT "FK_600bc9107002bfddd0e0d502a1c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" DROP CONSTRAINT "FK_c38b9abbe5e829fd7a45b4343be"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" DROP CONSTRAINT "FK_742b1a4cf3974e8019f21d4b02a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" DROP CONSTRAINT "FK_fba615191ab28354046a9b76a7d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" DROP CONSTRAINT "FK_2149d04cb57f16a282e0f53dbbf"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" DROP CONSTRAINT "FK_207b110b3aa39b937b0d3ef0afe"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" DROP CONSTRAINT "FK_fc34d2bba907a97ce2229aa74c8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_contract_info" DROP CONSTRAINT "FK_fbc34ff9e3a808d7b5b07d9dc19"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_job_description" DROP CONSTRAINT "FK_879a5980e67f1555958b82fe514"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_job_description" DROP CONSTRAINT "FK_cea8859c9592dbc54546167c58a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_disciplinary" DROP CONSTRAINT "FK_71e72aa0ed080fa848ec63b5a74"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login_permission" DROP CONSTRAINT "FK_7465fd05255c93c752440fc2493"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login_permission" DROP CONSTRAINT "FK_819b96449e4271cc6ed7c6244f7"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login_permission" DROP CONSTRAINT "FK_fe4f6638cb97a3fa6efda74dc1d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" DROP CONSTRAINT "FK_3319d80bd5c6827c00a7d6a0c42"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_d82bb2b9bc944d4d0253ec41b10"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_5aa8df6a548bebb12acd4684177"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_1b12a3fe9011a0137c1edaf3dd8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_70b18de017f28beccd56938c869"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_afbe58badd3cd0d27337dd1c9e8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_116c817ea16520a6eeaebf1dc5c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_71b366c09d68c7738158059b4fd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_84c87e5bdbd546c898e02cb8cdd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_495d65f77037f05edbd736d8366"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_e1088c0a7c5bf4c9feb2889026d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_103554d7c3d847dfa235b650eb5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business" DROP CONSTRAINT "FK_3610d70280a6aff762ec3136730"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_budget" DROP CONSTRAINT "FK_290fae4d94d1ad1e362e4b80ef4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_budget" DROP CONSTRAINT "FK_e0e851c48096a5b0dec8890cd41"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" DROP CONSTRAINT "FK_2801f86a53964a043a98fd1ccf0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" DROP CONSTRAINT "FK_17d46d6c630af32d4b409292033"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" DROP CONSTRAINT "FK_e05d3b1e6402c058d349ce72f51"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" DROP CONSTRAINT "FK_d47da843de873974322a05d74fe"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_cocument" DROP CONSTRAINT "FK_4d40fadadd60a4536f8441f63fa"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_batch" DROP CONSTRAINT "FK_2707c5d58423776b025d797f6a1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_batch" DROP CONSTRAINT "FK_052d415e15e2212c297e4d8c128"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_batch" DROP CONSTRAINT "FK_1fb6ad101687241d7be03bb1a22"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" DROP CONSTRAINT "FK_e8bd36476d0e45f1b1c3148a6db"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" DROP CONSTRAINT "FK_5aa92df7c6e5303d7010c8e0318"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" DROP CONSTRAINT "FK_9a23106693b266ba869fef6b807"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_medical_visists" DROP CONSTRAINT "FK_f44c8a8a03e2f3b5bd391fbe681"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_career_path" DROP CONSTRAINT "FK_1349edadf3c94077fea13785456"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP CONSTRAINT "FK_a59f87e9a17652e71a063cb59b8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP CONSTRAINT "FK_39dd0b1aecd66ca4269cd066a06"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave_period" DROP CONSTRAINT "FK_513169cd06475518e3fff1e3a71"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave_distribution" DROP CONSTRAINT "FK_06fda3411b977c3d0a5109d1c96"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_employee_document_status_enum_old" AS ENUM('STATUS_WAITING_FILE', 'STATUS_WAITING_SIGNATURE', 'STATUS_SIGNED', 'STATUS_NOT_SIGNED', 'STATUS_REFUSED', 'STATUS_ACCEPTED', 'STATUS_TRANSMITTED', 'STATUS_SIGNATURE_IN_PROGRESS')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_document" ALTER COLUMN "status" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_document" ALTER COLUMN "status" TYPE "tellos"."tellos_employee_document_status_enum_old" USING "status"::"text"::"tellos"."tellos_employee_document_status_enum_old"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee_document" ALTER COLUMN "status" SET DEFAULT 'STATUS_WAITING_FILE'`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_employee_document_status_enum"`,
        );
        await queryRunner.query(
            `ALTER TYPE "tellos"."tellos_employee_document_status_enum_old" RENAME TO "tellos_employee_document_status_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" DROP COLUMN "regulation_code_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" ADD "regulation_code_id" "tellos"."tellos_customer_regulation_code_id_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ALTER COLUMN "end_date" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ALTER COLUMN "start_date" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" DROP CONSTRAINT "UQ_442589cd383daf886550f0e35d1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" DROP COLUMN "contract_info_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" DROP COLUMN "type"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_employee_type_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login" DROP COLUMN "is_external"`,
        );
        await queryRunner.query(
            `COMMENT ON COLUMN "tellos_login"."lastname" IS 'Encryption value for field lastname'`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login" DROP COLUMN "lastname"`,
        );
        await queryRunner.query(
            `COMMENT ON COLUMN "tellos_login"."firstname" IS 'Encryption value for field firstname'`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_login" DROP COLUMN "firstname"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_qualification" DROP COLUMN "from_my_account"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_qualification" DROP COLUMN "status"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_qualification_status_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_entity" DROP COLUMN "membership_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_entity" DROP COLUMN "type"`,
        );
        await queryRunner.query(`DROP TYPE "tellos"."tellos_entity_type_enum"`);
        await queryRunner.query(
            `ALTER TABLE "tellos_career_path" DROP COLUMN "medical_visit_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "leave_period_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "entity_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "end_day"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_leave_end_day_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "start_day"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_leave_start_day_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" DROP COLUMN "motive"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" ADD "employee_contract_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" ADD CONSTRAINT "REL_45f0d3363a6ee7dd856184a957" UNIQUE ("employee_contract_id")`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_leave_entity_enum" AS ENUM('TELLOS', 'SOGECA', 'SOGECA_THERM', 'SMTPF', 'SMARTFIB', 'SABLIERE', 'CGR', 'ABILCITY')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD "entity" "tellos"."tellos_leave_entity_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_leave_type_enum" AS ENUM('PAID_LEAVE', 'UNPAID_ABSENCE', 'RECOVERY', 'SICK_LEAVE', 'STOP_WORK_ACCIDENT', 'ANNOUNCEMENT_OF_A_DISABILITY_IN_A_CHILD', 'BEREAVEMENT_LEAVE_FOR_A_CHILD', 'SICK_CHILD', 'WEDDING', 'CHILD_WEDDIND', 'BIRTH_ADOPTION', 'ADOPTION', 'In_LAWS_FUNERAL', 'SPOUSE_FUNERAL', 'CHILD_FUNERAL', 'BROTHER_FUNERAL', 'SISTER_FUNERAL', 'PARENTS_FUNERAL')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD "type" "tellos"."tellos_leave_type_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_leave" ADD "request_date" TIMESTAMP NOT NULL DEFAULT now()`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_e315c22962c0083c4ffda08293"`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_43113d0d61863cf074688e24df"`,
        );
        await queryRunner.query(
            `DROP TABLE "tellos_employee_disciplinary_files_upload"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_medical_visit_job"`);
        await queryRunner.query(`DROP TABLE "tellos_expense_post"`);
        await queryRunner.query(`DROP TABLE "tellos_section_code"`);
        await queryRunner.query(`DROP TABLE "tellos_purchase_account"`);
        await queryRunner.query(`DROP TABLE "tellos_category_equipment"`);
        await queryRunner.query(`DROP TABLE "tellos_work_entity"`);
        await queryRunner.query(`DROP TABLE "tellos_medium_size_centre"`);
        await queryRunner.query(`DROP TABLE "tellos_admin_document"`);
        await queryRunner.query(`DROP TABLE "tellos_contract"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_contract_type_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_contract_status_enum"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_contract_comment"`);
        await queryRunner.query(`DROP TABLE "tellos_contract_info"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_contract_info_age_category_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_contract_info_category_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_contract_info_leaving_raison_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_contract_info_renewal_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_contract_info_type_contract_enum"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_job_description"`);
        await queryRunner.query(`DROP TABLE "tellos_contract_level"`);
        await queryRunner.query(`DROP TABLE "tellos_contract_section"`);
        await queryRunner.query(`DROP TABLE "tellos_contract_apprentice"`);
        await queryRunner.query(`DROP TABLE "tellos_contract_type_payment"`);
        await queryRunner.query(`DROP TABLE "tellos_contract_type_entry"`);
        await queryRunner.query(`DROP TABLE "tellos_employee_disciplinary"`);
        await queryRunner.query(`DROP TABLE "tellos_login_permission"`);
        await queryRunner.query(`DROP TABLE "tellos_regulation_code"`);
        await queryRunner.query(`DROP TABLE "tellos_business"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_business_status_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_business_type_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_business_unit_enum"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_business_budget"`);
        await queryRunner.query(`DROP TABLE "tellos_business_cocument"`);
        await queryRunner.query(`DROP TABLE "tellos_business_document_type"`);
        await queryRunner.query(
            `DROP TABLE "tellos_business_document_classification"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_business_batch"`);
        await queryRunner.query(`DROP TABLE "tellos_business_batch_status"`);
        await queryRunner.query(`DROP TABLE "tellos_business_market_type"`);
        await queryRunner.query(`DROP TABLE "tellos_business_tender_type"`);
        await queryRunner.query(`DROP TABLE "tellos_business_payment_type"`);
        await queryRunner.query(`DROP TABLE "tellos_business_payment_mode"`);
        await queryRunner.query(`DROP TABLE "tellos_medical_visists"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_medical_visists_statut_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_medical_visists_contract_enum"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_leave_period"`);
        await queryRunner.query(`DROP TABLE "tellos_leave_distribution"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_leave_distribution_name_enum"`,
        );
        await queryRunner.query(
            `ALTER TYPE "tellos"."tellos_customer_regulation_code_id_enum" RENAME TO "tellos_customer_regulation_code_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_customer" RENAME COLUMN "regulation_code_id" TO "regulation_code"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_employee" ADD CONSTRAINT "FK_45f0d3363a6ee7dd856184a9574" FOREIGN KEY ("employee_contract_id") REFERENCES "tellos_employee_contract"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }
}
