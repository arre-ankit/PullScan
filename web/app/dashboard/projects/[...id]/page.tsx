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
import { CommitComponent } from "@/components/Commit"
import { ViewCommit } from "@/components/ViewCommit"

interface Project {
  id: string
  name: string
  githubUrl: string
        
}

interface Commit {
  id:string
  commitMessage: string
  commitAuthorName: string
  commitAuthorAvtar: string
  commitDate: string
  summary: string
}

export default function Page() {
  const { id } = useParams(); // Get the project ID from the URL
  const [project,setProject] = useState<Project | null>(null)
  const [commits,setCommits] = useState<Commit[]>([])
  const [selectedcommitId,setselectedCommitId] = useState("")
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
      fetchProjectDetails();
      fetchCommits();

    }, [id]);


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "510px",
        } as React.CSSProperties
      }
    >
      <AppSidebar commit={commits}/>
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
                <BreadcrumbPage>Commit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </div>
          <div>
          <SelectProjectToggle onProjectSelect={handleProjectSelect} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
        {id}
        <ViewCommit />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
