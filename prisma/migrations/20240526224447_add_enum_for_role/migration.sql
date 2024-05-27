/*
  Warnings:

  - You are about to drop the column `is_seller` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SELLER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_seller",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
