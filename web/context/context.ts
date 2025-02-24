import { Commit, NavItem, PR, Question } from "@/lib/types";
import { createContext } from "react";

interface CurrentCommitContextType {
    currentCommit: Commit | undefined
    setCurrentCommit: (commit: Commit) => void
}


interface CurrentPRContextType {
    currentPR: PR | undefined
    setCurrentPR: (pr: PR) => void
}

interface CurrentItemContextType {
    currentItem: NavItem | undefined
    setCurrentItem: (item: NavItem) => void
}

interface CurrentQuestionContextType{
    currentQuestion: Question| undefined,
    setCurrentQuestion: (question: Question) => void
}

export const CommitContext = createContext<Commit[] | undefined>(undefined);
export const PRContext = createContext<PR[] | undefined>(undefined);
export const QuestionContext = createContext<Question[] | undefined>(undefined);


export const CurrentCommitContext = createContext<CurrentCommitContextType>({
    currentCommit: undefined,
    setCurrentCommit: () => {}
})

export const CurrentPRContext = createContext<CurrentPRContextType>({
    currentPR: undefined,
    setCurrentPR: () => {}
})

export const CurrentQuestionContext = createContext<CurrentQuestionContextType>({
    currentQuestion: undefined,
    setCurrentQuestion: () => {}
})

export const CurrentItemContext = createContext<CurrentItemContextType>({
    currentItem: undefined,
    setCurrentItem: () => {}
})