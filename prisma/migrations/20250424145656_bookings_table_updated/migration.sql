/*
  Warnings:

  - You are about to drop the column `price` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingSlot` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingType` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalAmountPaid` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('once', 'weekly', 'monthly');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "price",
ADD COLUMN     "basePrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "bookingSlot" TEXT NOT NULL,
ADD COLUMN     "bookingType" "BookingType" NOT NULL,
ADD COLUMN     "discount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "finalAmountPaid" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "gst" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "platformFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
