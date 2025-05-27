/*
  Warnings:

  - Added the required column `balance` to the `CreditsTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `CreditsTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditsTransaction" ADD COLUMN     "balance" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL;
