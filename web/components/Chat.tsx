"use client"
import { CurrentQuestionContext } from "@/context/context"
import { Question } from "../lib/types"
import { useContext } from "react"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"

export function QuestionComponent({questions}:any) {

  const { setCurrentQuestion } = useContext(CurrentQuestionContext)
  const user = useUser();

  const handleChatSelect = (question: Question) => {
    setCurrentQuestion(question)
  }

  return (
    <>
    {questions.map((question:Question) => (
        <div key={`${question.id}-${question.answer}`}>
            <a
                href="#"
                key={question.id}
                onClick={() => {handleChatSelect(question)}}
                className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
                <div className="flex w-full items-center gap-2">
                <Image alt={user.user?.imageUrl || ""} src={user.user?.imageUrl || ""} width={20} height={20} className="flex-none rounded-full bg-gray-50"></Image>
                <span className="text-sm font-semibold w-2">{question.question}</span>
                </div>
            </a>
        </div>
        ))}
    </>
  )
}

