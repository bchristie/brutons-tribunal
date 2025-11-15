-- CreateEnum
CREATE TYPE "UpdateType" AS ENUM ('CASE_STUDY', 'DISCUSSION', 'EVENT', 'NEWS', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "UpdateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "updates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "type" "UpdateType" NOT NULL,
    "status" "UpdateStatus" NOT NULL DEFAULT 'PUBLISHED',
    "linkHref" TEXT,
    "linkText" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,

    CONSTRAINT "updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "updates_type_idx" ON "updates"("type");

-- CreateIndex
CREATE INDEX "updates_status_idx" ON "updates"("status");

-- CreateIndex
CREATE INDEX "updates_publishedAt_idx" ON "updates"("publishedAt");

-- CreateIndex
CREATE INDEX "updates_createdAt_idx" ON "updates"("createdAt");

-- AddForeignKey
ALTER TABLE "updates" ADD CONSTRAINT "updates_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
