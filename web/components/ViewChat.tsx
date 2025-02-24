import { useContext, useState } from "react";
import { Card } from "./ui/card";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CurrentQuestionContext } from "@/context/context";
import { Separator } from "@radix-ui/react-separator";
import { ChatBox } from "./QuestionComponent";

export function ViewChat() {
    const [question,setQuestion] = useState('')
    const [loading,setloading] = useState(false)
    const {projectId} = useParams()
    const { user } = useUser();
    const { currentQuestion } = useContext(CurrentQuestionContext)

    if (!currentQuestion) {
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
              <div className="space-y-1 flex-1">
                <h1 className="text-xl font-semibold leading-tight">
                  Question: {currentQuestion.question}
                </h1>
              </div>
            </div>
          </div>

          <Separator />


          <Separator />

          {/* Commit Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Answer</h2>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-muted-foreground">
                {currentQuestion.answer}
              </pre>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-6">
      <ChatBox />
      </div>
    </div>
  </div>

  )
}
