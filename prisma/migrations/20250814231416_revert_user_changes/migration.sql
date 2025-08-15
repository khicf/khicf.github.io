/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `approvedById` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_approvedById_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "approvedAt",
DROP COLUMN "approvedById",
DROP COLUMN "role",
DROP COLUMN "status";
