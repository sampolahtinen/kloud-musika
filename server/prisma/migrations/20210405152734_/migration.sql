/*
  Warnings:

  - A unique constraint covering the columns `[metadataId]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TrackMetadata" DROP CONSTRAINT "TrackMetadata_trackId_fkey";

-- DropIndex
DROP INDEX "TrackMetadata_trackId_unique";

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "metadataId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Track_metadataId_unique" ON "Track"("metadataId");

-- AddForeignKey
ALTER TABLE "Track" ADD FOREIGN KEY ("metadataId") REFERENCES "TrackMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
