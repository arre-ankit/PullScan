"use client"
import { useContext } from "react"
import { CurrentCommitContext } from "@/context/context"
import { Card } from "./ui/card"
import { Separator } from "@radix-ui/react-separator"
import { Clock,GitCommit } from "lucide-react"
import Image from "next/image"

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
    <div className="h-full overflow-auto">
    <div className=" p-6">
      <Card className="overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Image
                alt={currentCommit.commitAuthorName}
                src={currentCommit.commitAuthorAvtar}
                width={48}
                height={48}
                className="rounded-full border bg-background"
              />
              <div className="space-y-1 flex-1">
                <h1 className="text-xl font-semibold leading-tight">
                  {currentCommit.commitMessage}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {currentCommit.commitAuthorName}
                  </span>
                  committed on
                  <time>{currentCommit.commitDate}</time>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Commit Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Commit</span>
                <code className="px-2 py-1 rounded bg-muted text-xs">
                  {currentCommit.id}
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Committed</span>
                <time className="text-muted-foreground">
                  {currentCommit.commitDate}
                </time>
              </div>
            </div>
          </div>

          <Separator />

          {/* Commit Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-muted-foreground">
                {currentCommit.summary}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
  )
}