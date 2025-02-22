/*
  Warnings:

  - Changed the type of `pullReqNumber` on the `Pr` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pr" DROP COLUMN "pullReqNumber",
ADD COLUMN     "pullReqNumber" INTEGER NOT NULL;
