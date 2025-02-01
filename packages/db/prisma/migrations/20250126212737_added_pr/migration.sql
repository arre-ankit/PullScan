/*
  Warnings:

  - You are about to drop the `PR` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PR" DROP CONSTRAINT "PR_projectId_fkey";

-- DropTable
DROP TABLE "PR";

-- CreateTable
CREATE TABLE "Pr" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "pullReqTitle" TEXT NOT NULL,
    "pullReqMessage" TEXT NOT NULL,
    "pullReqHash" TEXT NOT NULL,
    "pullReqAuthorName" TEXT NOT NULL,
    "pullReqAuthorAvtar" TEXT NOT NULL,
    "pullReqDate" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "Pr_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pr" ADD CONSTRAINT "Pr_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
