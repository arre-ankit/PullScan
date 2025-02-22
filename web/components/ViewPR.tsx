"use client"
import { useContext } from "react"
import { CurrentPRContext } from "@/context/context"
import { Card } from "./ui/card"
import Image from "next/image"
import { Separator } from "@radix-ui/react-separator"
import { Clock, GitBranch, GitCommit, GitPullRequest } from "lucide-react"
import { ChatComponent } from "./Chat"

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
      <div className="h-full overflow-auto">
    <div className=" p-6">
      <Card className="overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Image
                alt={currentPR.pullReqAuthorName}
                src={currentPR.pullReqAuthorAvtar}
                width={48}
                height={48}
                className="rounded-full border bg-background"
              />
              <div className="space-y-1 flex-1">
                <h1 className="text-xl font-semibold leading-tight line-clamp-3">
                  {currentPR.pullReqMessage}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {currentPR.pullReqAuthorName}
                  </span>
                  pullrequest at
                  <time>{currentPR.pullReqDate}</time>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Commit Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">PR Number</span>
                <code className="px-2 py-1 rounded bg-muted text-xs">
                  {currentPR.pullReqNumber}
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">PullRequest</span>
                <time className="text-muted-foreground">
                  {currentPR.pullReqDate}
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
                {currentPR.summary}
              </pre>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-6">
      <ChatComponent/>
      </div>
    </div>
  </div>
  )
}