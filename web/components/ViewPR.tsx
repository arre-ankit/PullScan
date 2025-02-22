"use client"
import { useContext } from "react"
import { CurrentPRContext } from "@/context/context"

export function ViewPR() {
  const { currentPR } = useContext(CurrentPRContext)

  if (!currentPR) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a commit to view details</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{currentPR.pullReqMessage}</h2>
      <div className="flex items-center gap-2 mb-4">
        <div>
          <p className="font-medium">{currentPR.pullReqAuthorName}</p>
          <p className="text-sm text-gray-500">Commit ID: {currentPR.pullReqDate}</p>
        </div>
      </div>
      <div className="prose max-w-none">
        <p>{currentPR.summary}</p>
        {/* Add more commit details as needed */}
      </div>
    </div>
  )
}