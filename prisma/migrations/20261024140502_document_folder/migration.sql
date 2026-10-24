/*
  Warnings:

  - Added the required column `folder` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "folder" TEXT NOT NULL;
