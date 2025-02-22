/*
  Warnings:

  - You are about to drop the column `prReqNumber` on the `Pr` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pr" DROP COLUMN "prReqNumber",
ADD COLUMN     "pullReqNumber" TEXT NOT NULL DEFAULT 'default_value';
