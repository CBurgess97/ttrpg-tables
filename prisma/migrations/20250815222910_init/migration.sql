-- CreateTable
CREATE TABLE "public"."Table" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "source" TEXT,
    "sides" INTEGER,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Row" (
    "id" SERIAL NOT NULL,
    "tableId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rangemin" INTEGER NOT NULL,
    "rangemax" INTEGER NOT NULL,

    CONSTRAINT "Row_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Row" ADD CONSTRAINT "Row_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
