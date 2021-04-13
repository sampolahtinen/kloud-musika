/*
  Warnings:

  - You are about to drop the column `lastCursor` on the `CloudSyncMetadata` table. All the data in the column will be lost.
  - Added the required column `lastImportedCursor` to the `CloudSyncMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latestCursor` to the `CloudSyncMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CloudSyncMetadata" DROP COLUMN "lastCursor",
ADD COLUMN     "lastImportedCursor" TEXT NOT NULL,
ADD COLUMN     "latestCursor" TEXT NOT NULL;
