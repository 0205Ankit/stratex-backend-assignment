/*
  Warnings:

  - You are about to drop the column `published_date` on the `Books` table. All the data in the column will be lost.
  - Added the required column `publishedDate` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" DROP COLUMN "published_date",
ADD COLUMN     "publishedDate" TEXT NOT NULL;
