/*
  Warnings:

  - The primary key for the `Row` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Row" DROP CONSTRAINT "Row_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Row_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Row_id_seq";
