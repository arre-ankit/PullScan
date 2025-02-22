"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Command,GitCommitHorizontal, GitPullRequestArrow, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"
import SelectProjectToggle from "@/components/select-project-toggle"
import { ViewCommit } from "@/components/ViewCommit"
import { CommitContext, CurrentCommitContext, CurrentItemContext, CurrentPRContext, PRContext } from "@/context/context"
import { Commit, NavItem, PR, Project } from "@/lib/types"
import { ViewPR } from "@/components/ViewPR"


export const data = {
  navMain: [
    {
      title: "Commits",
      icon: GitCommitHorizontal ,
      isActive: false,
      url: 'commits'
    },
    {
      title: "PRs",
      icon: GitPullRequestArrow,
      isActive: false,
      url: 'prs'
    },
    {
      title: "Chat",
      icon: MessageCircle,
      isActive: true,
      url: 'questions'
    }
  ]
}

export default function Page() {
  const { id } = useParams(); // Get the project ID from the URL
  const [project,setProject] = useState<Project | null>(null)
  const [commits,setCommits] = useState<Commit[]>([])
  const [currentCommit, setCurrentCommit] = useState<Commit | undefined>(undefined)
  const [currentPR, setCurrentPR] = useState<PR | undefined>(undefined)
  const [currentItem, setCurrentItem] = useState<NavItem | undefined>(data.navMain[0])
  const [prs,setprs] = useState<PR[]>([])
  const {user} = useUser();
  const email = user?.emailAddresses  

  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    // Update the URL or state with the new project ID
    router.push(`/dashboard/projects/${projectId}`);
  };

  useEffect(() => {
    if(!id) return

      const fetchProjectDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8080/v1/api/projects/${id}`, {
            headers: {
              'Authorization': `${email}`
            }
          });
          const data = await response.json();
    
          // Update project details and commits
          setProject(data.project) 
        } catch (error) {
          console.error("Error fetching project details:", error);
          setProject(null)
        }
      }

      const fetchCommits = async () => {
        try {
          const response = await fetch(`http://localhost:8080/v1/api/projects/${id}/commits`,{
            headers:{
              'Authorization': `${email}`
            }
          })
          const data = await response.json();
          setCommits(data.commits)
        }
        catch (error) {
          console.error("Error fetching project details:", error);
          setCommits([])
        }
      }

      const fetchPRs = async () => {
        try {
          const response = await fetch(`http://localhost:8080/v1/api/projects/${id}/prs`,{
            headers:{
              'Authorization': `${email}`
            }
          })
          const data = await response.json();
          setprs(data.commits)
        }
        catch (error) {
          console.error("Error fetching project details:", error);
          setprs([])
        }
      }

      fetchProjectDetails();
      fetchCommits();
      fetchPRs();

    }, [id]);



  return (
    <CurrentItemContext.Provider value={{currentItem,setCurrentItem}}>
    <CurrentPRContext.Provider value={{currentPR,setCurrentPR}}>
    <CurrentCommitContext.Provider value={{ currentCommit, setCurrentCommit }}>
    <CommitContext.Provider value={commits}>
    <PRContext.Provider value={prs}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "510px",
          } as React.CSSProperties
        }
      >
        <AppSidebar commit={commits} />
        <SidebarInset>
          <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 justify-between">
            <div className="flex">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-5" />
            <Breadcrumb className="px-3 my-1">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>{project?.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentItem?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
            <div>
            <SelectProjectToggle onProjectSelect={handleProjectSelect} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
          {currentItem?.title === "Chat" }
            {currentItem?.title === "PRs" && <ViewPR/> }
            {currentItem?.title === "Commits" && <ViewCommit/>}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PRContext.Provider>
    </CommitContext.Provider>
    </CurrentCommitContext.Provider>
    </CurrentPRContext.Provider>
    </CurrentItemContext.Provider>
  )
}
