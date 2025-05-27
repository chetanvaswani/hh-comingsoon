/*
  Warnings:

  - A unique constraint covering the columns `[mobileNumber]` on the table `WaitlistEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_mobileNumber_key" ON "WaitlistEntry"("mobileNumber");
