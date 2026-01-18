/*
  Warnings:

  - The primary key for the `TransactionalProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TransactionalProducts" DROP CONSTRAINT "TransactionalProducts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TransactionalProducts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TransactionalProducts_id_seq";
