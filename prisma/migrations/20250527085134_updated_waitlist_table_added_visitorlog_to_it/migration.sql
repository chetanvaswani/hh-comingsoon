/*
  Warnings:

  - You are about to drop the column `address` on the `WaitlistEntry` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `WaitlistEntry` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `WaitlistEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WaitlistEntry" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "visitorLogId" INTEGER;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_visitorLogId_fkey" FOREIGN KEY ("visitorLogId") REFERENCES "WaitlistVisitorLocationLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
