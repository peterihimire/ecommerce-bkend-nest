/*
  Warnings:

  - You are about to drop the `CartProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartProducts" DROP CONSTRAINT "CartProducts_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartProducts" DROP CONSTRAINT "CartProducts_productId_fkey";

-- DropTable
DROP TABLE "CartProducts";

-- CreateTable
CREATE TABLE "cart_products" (
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" TEXT NOT NULL,

    CONSTRAINT "cart_products_pkey" PRIMARY KEY ("productId","cartId")
);

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
