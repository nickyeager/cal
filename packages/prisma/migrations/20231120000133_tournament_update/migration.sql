-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "slug" TEXT,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;
