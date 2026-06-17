-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "customerFirstName" DROP DEFAULT,
ALTER COLUMN "customerLastName" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "breakDuration" INTEGER;
