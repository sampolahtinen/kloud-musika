/*
  Warnings:

  - You are about to drop the column `trackId` on the `TrackMetadata` table. All the data in the column will be lost.
  - Made the column `metadataId` on table `Track` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Track_metadataId_unique";

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "metadataId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrackMetadata" DROP COLUMN "trackId";
