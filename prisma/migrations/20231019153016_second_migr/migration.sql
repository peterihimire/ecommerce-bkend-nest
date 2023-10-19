/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `cart_products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quantity` to the `cart_products` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `cart_products` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "cart_products" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_products_uuid_key" ON "cart_products"("uuid");
