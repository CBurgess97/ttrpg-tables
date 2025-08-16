/*
  Warnings:

  - The primary key for the `Table` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Row" DROP CONSTRAINT "Row_tableId_fkey";

-- AlterTable
ALTER TABLE "public"."Row" ALTER COLUMN "tableId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Table" DROP CONSTRAINT "Table_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Table_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Table_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Row" ADD CONSTRAINT "Row_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
