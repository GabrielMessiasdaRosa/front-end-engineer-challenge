/*
  Warnings:

  - A unique constraint covering the columns `[productName]` on the table `TransactionalProducts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TransactionalProducts_productName_key" ON "TransactionalProducts"("productName");
