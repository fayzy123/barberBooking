/*
  Warnings:

  - You are about to drop the column `customerName` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "customerName",
ADD COLUMN     "customerFirstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "customerLastName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "firstName" DROP DEFAULT,
ALTER COLUMN "lastName" DROP DEFAULT;
