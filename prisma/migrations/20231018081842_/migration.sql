/*
  Warnings:

  - A unique constraint covering the columns `[prodId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_prodId_key" ON "products"("prodId");
