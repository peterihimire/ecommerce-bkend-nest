/*
  Warnings:

  - Made the column `acctId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_acctId_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "acctId" SET NOT NULL,
ALTER COLUMN "acctId" SET DATA TYPE TEXT;
