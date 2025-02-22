"use client"
import { useContext } from "react"
import { CurrentCommitContext } from "@/context/context"

export function ViewCommit() {
  const { currentCommit } = useContext(CurrentCommitContext)

  if (!currentCommit) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a commit to view details</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{currentCommit.commitMessage}</h2>
      <div className="flex items-center gap-2 mb-4">
        <div>
          <p className="font-medium">{currentCommit.commitAuthorName}</p>
          <p className="text-sm text-gray-500">Commit ID: {currentCommit.id}</p>
        </div>
      </div>
      <div className="prose max-w-none">
        <p>{currentCommit.summary}</p>
        {/* Add more commit details as needed */}
      </div>
    </div>
  )
}