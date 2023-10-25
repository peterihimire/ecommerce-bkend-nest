/*
  Warnings:

  - You are about to alter the column `amount` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(9,2)`.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(9,2)`.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(9,2)`.

*/
-- AlterTable
ALTER TABLE "order_products" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "transaction_reference" SET DATA TYPE TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(9,2);
