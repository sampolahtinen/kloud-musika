-- CreateTable
CREATE TABLE "CloudSyncMetadata" (
    "id" TEXT NOT NULL,
    "lastCursor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importFileCount" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloudSyncMetadata.lastCursor_unique" ON "CloudSyncMetadata"("lastCursor");
