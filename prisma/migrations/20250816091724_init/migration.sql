/*
  Warnings:

  - You are about to drop the column `name` on the `Table` table. All the data in the column will be lost.
  - Added the required column `description` to the `Table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Table" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
