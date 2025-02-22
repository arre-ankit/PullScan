export interface Commit {
    id: string
    commitMessage: string
    commitAuthorName: string
    commitAuthorAvtar: string
    commitDate: string
    summary: string
}

export interface PR {
    pullReqTitle: string
    pullReqMessage: string
    pullReqAuthorName: string
    pullReqAuthorAvtar: string
    pullReqDate: string
    summary: string
}

export interface Project {
    id: string
    name: string
    githubUrl: string
}

export interface NavItem {
    title: string
    icon: any
    isActive: boolean
    url: string 
}