import { Commit, NavItem, PR } from "@/lib/types";
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

export const CommitContext = createContext<Commit[] | undefined>(undefined);
export const PRContext = createContext<PR[] | undefined>(undefined);


export const CurrentCommitContext = createContext<CurrentCommitContextType>({
    currentCommit: undefined,
    setCurrentCommit: () => {}
})

export const CurrentPRContext = createContext<CurrentPRContextType>({
    currentPR: undefined,
    setCurrentPR: () => {}
})

export const CurrentItemContext = createContext<CurrentItemContextType>({
    currentItem: undefined,
    setCurrentItem: () => {}
})