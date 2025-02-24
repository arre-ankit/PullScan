/*
  Warnings:

  - You are about to drop the column `pipe_api_key` on the `QuestionAgent` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `QuestionAgent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuestionAgent" DROP COLUMN "pipe_api_key",
DROP COLUMN "status";
