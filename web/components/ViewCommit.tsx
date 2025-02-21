"use client"

import { useParams } from "next/navigation";
import { useRecoilValue } from 'recoil';
import { selectedCommitIdState } from '../store/atoms/commit'; // Adjust the path as necessary

export function ViewCommit() {
  const selectedCommitId = useRecoilValue(selectedCommitIdState);

  // Use selectedCommitId to fetch or display the commit details
  return (
    <div>
      {selectedCommitId ? (
        <div>Displaying details for commit ID: {selectedCommitId}</div>
      ) : (
        <div>No commit selected</div>
      )}
      Hi
    </div>
  );
}