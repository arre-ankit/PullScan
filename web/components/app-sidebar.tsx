"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useUser } from '@clerk/nextjs';
import { CommitComponent } from "./Commit"

import { PrComponent } from "./PR"
import { useParams } from "next/navigation";
import { Commit, PR, Question } from "@/lib/types";
import { CurrentItemContext } from "@/context/context";
import { GitCommitHorizontal, GitPullRequestArrow, MessageCircle } from "lucide-react"
import { QuestionComponent } from "./Chat";

const data = {
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
      url: 'chats'
    }
  ]
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  commit: Commit[] | null
}

export function AppSidebar({commit, ...props }:AppSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const { id } = useParams(); // Get the project ID from the URL
  const [commits,setCommits] = React.useState<Commit[]>(commit || [])
  const [prs,setPRs] = React.useState<PR[]>([])
  const [questions,setQuestions] = React.useState<Question[]>([])
  const { user } = useUser();
  const email = user?.emailAddresses 
  const { currentItem } = React.useContext(CurrentItemContext)
  const {setCurrentItem} =  React.useContext(CurrentItemContext)


  const handleNavItemClick = async (item:any) => {
    setCurrentItem(item)
    
    // Call the API based on the navMain title and URL
    try {
      const response = await fetch(`https://pullscan.onrender.com/v1/api/projects/${id}/${item.url}`,{
        headers:{
          'Authorization': `${email}`
        }
      }); 
      const data = await response.json();

      if (item.title === "Chat") {
        setQuestions(data.chats || []);
        
      } else if (item.title === "PRs") {
        setPRs(data.prs || []); // Set PRs for PRs
      } else if (item.title === "Commits") {
        setCommits(data.commits || []); // Set commits for Commits
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_100px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex justify-center flex-1 text-left text-lg leading-tight">
                    <span className="truncate font-semibold">PullScan</span>
                  </div>
                </a> 
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {handleNavItemClick(item)}}
                      isActive={currentItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between space-y-2">
            <div className="text-base font-medium text-foreground">
              {currentItem?.title}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
            {currentItem?.title === "Chat" && <QuestionComponent questions={questions}/>}
            {currentItem?.title === "PRs" && <PrComponent prs={prs}/> }
            {currentItem?.title === "Commits" && (
              <CommitComponent
                commits={commits}
              />
            )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
