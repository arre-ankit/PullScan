"use client"
import Image from "next/image"
import { useState } from "react"
import { Commit } from "./app-sidebar";
import { useSetRecoilState } from 'recoil';
import { selectedCommitIdState } from '../store/atoms/commit' // Adjust the path as necessary

interface CommitComponentProps {
  commits: Commit[];
  onCommitSelect: (commit: Commit | null) => void; // New prop for handling commit selection
}

export function CommitComponent({ commits = [], onCommitSelect }: CommitComponentProps) {
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null);
  const setSelectedCommitId = useSetRecoilState(selectedCommitIdState);

  const handleCommitClick = (commit: Commit) => {
    const isSelected = expandedCommit === commit.id;
    setExpandedCommit(isSelected ? null : commit.id);
    onCommitSelect(isSelected ? null : commit); // Notify parent about the selected commit
    setSelectedCommitId(isSelected ? null : commit.id); // Update Recoil state
  };

  return (
    <>
      {commits.map((commit: Commit) => (
        <div key={`${commit.id}`}>
          <a
            href={`#${commit.id}`}
            onClick={() => handleCommitClick(commit)}
            className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
