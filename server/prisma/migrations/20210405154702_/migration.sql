/*
  Warnings:

  - A unique constraint covering the columns `[metadataId]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Track_metadataId_unique" ON "Track"("metadataId");
