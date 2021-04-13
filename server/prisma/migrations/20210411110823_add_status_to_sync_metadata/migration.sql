/*
  Warnings:

  - Added the required column `status` to the `CloudSyncMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('OK', 'ERROR');

-- AlterTable
ALTER TABLE "CloudSyncMetadata" ADD COLUMN     "status" "SyncStatus" NOT NULL;
