# Migration `20200324140313-change-metadat-namasdfdsfe`

This migration has been generated by Sampo Lahtinen at 3/24/2020, 2:03:13 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "public"."Track_metadata"

ALTER TABLE "public"."Track" DROP CONSTRAINT IF EXiSTS "Track_metadata_fkey",
DROP COLUMN "metadata",
ADD COLUMN "trackMetadata" integer  NOT NULL ;

CREATE UNIQUE INDEX "Track_trackMetadata" ON "public"."Track"("trackMetadata")

ALTER TABLE "public"."Track" ADD FOREIGN KEY ("trackMetadata")REFERENCES "public"."TrackMetadata"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200324135942-change-metadat-name..20200324140313-change-metadat-namasdfdsfe
--- datamodel.dml
+++ datamodel.dml
@@ -1,8 +1,8 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = "postgresql://sampo@localhost:5432/kloud_muzika"
 }
 generator client {
   provider = "prisma-client-js"
@@ -23,13 +23,13 @@
   posts Post[]
 }
 model Track {
-  id       Int           @id @default(autoincrement())
-  title    String
-  fileId   String?
-  artist   Artist
-  metadata TrackMetadata
+  id            Int           @id @default(autoincrement())
+  title         String
+  fileId        String?
+  artist        Artist
+  trackMetadata TrackMetadata
 }
 model Artist {
   id      Int     @id @default(autoincrement())
```

