-- CreateTable
CREATE TABLE "TrackMetadata" (
    "id" TEXT NOT NULL,
    "original_file_path" TEXT NOT NULL,
    "direct_link" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackMetadata_trackId_unique" ON "TrackMetadata"("trackId");

-- AddForeignKey
ALTER TABLE "TrackMetadata" ADD FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
