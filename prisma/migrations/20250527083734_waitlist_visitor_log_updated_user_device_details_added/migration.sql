-- AlterTable
ALTER TABLE "WaitlistVisitorLocationLog" ADD COLUMN     "deviceName" TEXT,
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "platform" TEXT,
ADD COLUMN     "screenResolution" TEXT,
ADD COLUMN     "userAgent" TEXT;
