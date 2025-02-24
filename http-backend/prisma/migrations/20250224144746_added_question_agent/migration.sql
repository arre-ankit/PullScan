/*
  Warnings:

  - You are about to drop the `SourceCodeEmbedding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SourceCodeEmbedding" DROP CONSTRAINT "SourceCodeEmbedding_projectId_fkey";

-- DropTable
DROP TABLE "SourceCodeEmbedding";

-- CreateTable
CREATE TABLE "QuestionAgent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pipename" TEXT NOT NULL,
    "pipeDescription" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pipe_api_key" TEXT NOT NULL,
    "memoryName" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "QuestionAgent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionAgent_projectId_key" ON "QuestionAgent"("projectId");

-- AddForeignKey
ALTER TABLE "QuestionAgent" ADD CONSTRAINT "QuestionAgent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
