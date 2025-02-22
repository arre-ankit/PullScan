"use client"
import Image from "next/image"
import { Commit } from "@/lib/types";
import { CurrentCommitContext } from "@/context/context";
import { useContext, useState } from "react";

interface CommitInterface {
  commits: Commit[]
}
export function CommitComponent({ commits }: CommitInterface) {
  const { setCurrentCommit } = useContext(CurrentCommitContext)

  const handleCommitSelect = (commit: Commit) => {
    setCurrentCommit(commit)
  }

  return (
    <>
      {commits.map((commit: Commit) => (
        <div key={`${commit.id}`}>
          <a
            href={`#${commit.id}`}
            className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => handleCommitSelect(commit)}
          >
            <div className="flex w-full items-center gap-2">
              <Image alt={commit.commitAuthorName} src={commit.commitAuthorAvtar} width={20} height={20} className="flex-none rounded-full bg-gray-50"></Image>
              <span className="text-sm font-semibold w-1">{commit.commitMessage}</span>
            </div>
            <span className="font-medium">{commit.commitAuthorName}</span>
            <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
              {commit.summary}
            </span>
          </a>
        </div>
      ))}
    </>
  );
}
