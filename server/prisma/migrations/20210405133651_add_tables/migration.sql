-- CreateTable
CREATE TABLE "TrackMetadata" (
    "id" SERIAL NOT NULL,
    "original_file_path" TEXT NOT NULL,
    "direct_link" TEXT NOT NULL,
    "trackId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileId" TEXT,
    "artistId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "release_date" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track.fileId_unique" ON "Track"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist.name_unique" ON "Artist"("name");

-- AddForeignKey
ALTER TABLE "TrackMetadata" ADD FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
