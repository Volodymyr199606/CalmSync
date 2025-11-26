/*
  Warnings:

  - Added the required column `durationMinutes` to the `relaxation_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feeling` to the `relaxation_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryContentType` to the `relaxation_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `relaxation_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mood_check_ins" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "relaxation_sessions" ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "feeling" "FeelingType" NOT NULL,
ADD COLUMN     "primaryContentType" "ContentType" NOT NULL,
ADD COLUMN     "severity" INTEGER NOT NULL,
ALTER COLUMN "moodCheckInId" DROP NOT NULL;
