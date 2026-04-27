-- CreateTable
CREATE TABLE "GallerySkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "emptyCount" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GalleryWork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "result" TEXT NOT NULL DEFAULT '',
    "year" TEXT NOT NULL DEFAULT '',
    "desc" TEXT NOT NULL DEFAULT '',
    "thumbUrl" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GalleryWork_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "GallerySkill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GalleryPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eyebrow" TEXT NOT NULL DEFAULT '',
    "titleLine1" TEXT NOT NULL DEFAULT '',
    "titleLine2" TEXT NOT NULL DEFAULT '',
    "titleLine3" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "bannerTitle" TEXT NOT NULL DEFAULT '',
    "bannerSub" TEXT NOT NULL DEFAULT '',
    "bannerCta" TEXT NOT NULL DEFAULT '',
    "bannerHref" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GallerySkill_key_key" ON "GallerySkill"("key");

-- CreateIndex
CREATE INDEX "GallerySkill_order_idx" ON "GallerySkill"("order");

-- CreateIndex
CREATE INDEX "GalleryWork_skillId_order_idx" ON "GalleryWork"("skillId", "order");
