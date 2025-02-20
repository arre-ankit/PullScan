"use client"

import * as React from "react"
import { Command,GitCommitHorizontal, GitPullRequestArrow, MessageCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SelectProject } from "./select-project-toggle"
import { useUser } from '@clerk/clerk-react';
import { CommitComponent } from "./Commit"
import Image from "next/image"
import { PrComponent } from "./PR"

// This is sample data
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
      url: 'questions'
    }
  ],
  mails: [
    {
      name: "William Smith",
      email: "williamsmith@example.com",
      subject: "Meeting Tomorrow",
      date: "09:34 AM",
      teaser:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      name: "Alice Smith",
      email: "alicesmith@example.com",
      subject: "Re: Project Update",
      date: "Yesterday",
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      name: "Bob Johnson",
      email: "bobjohnson@example.com",
      subject: "Weekend Plans",
      date: "2 days ago",
      teaser:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      name: "Emily Davis",
      email: "emilydavis@example.com",
      subject: "Re: Question about Budget",
      date: "2 days ago",
      teaser:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      name: "Michael Wilson",
      email: "michaelwilson@example.com",
      subject: "Important Announcement",
      date: "1 week ago",
      teaser:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      name: "Sarah Brown",
      email: "sarahbrown@example.com",
      subject: "Re: Feedback on Proposal",
      date: "1 week ago",
      teaser:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      name: "David Lee",
      email: "davidlee@example.com",
      subject: "New Project Idea",
      date: "1 week ago",
      teaser:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      name: "Olivia Wilson",
      email: "oliviawilson@example.com",
      subject: "Vacation Plans",
      date: "1 week ago",
      teaser:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      name: "James Martin",
      email: "jamesmartin@example.com",
      subject: "Re: Conference Registration",
      date: "1 week ago",
      teaser:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      name: "Sophia White",
      email: "sophiawhite@example.com",
      subject: "Team Dinner",
      date: "1 week ago",
      teaser:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
  commits: [
    {
      commitMessage: "Add support for more LLM models (#186)",
      commitAuthorName: "Tomaz Bratanic",
      commitAuthorAvtar: "https://avatars.githubusercontent.com/u/19948365?v=4",
      commitDate: "2024-11-05T07:26:39.000Z",
      summary: "gojffdiodhf sgfdhigs iogsg m"
    },
    {
      commitMessage: "Add support for more LLM models (#186)",
      commitAuthorName: "Tomaz Bratanic",
      commitAuthorAvtar: "https://avatars.githubusercontent.com/u/19948365?v=4",
      commitDate: "2024-11-05T07:26:39.000Z",
      summary: "gojffdiodhf sgfdhigs iogsg m"
    },
    {
      commitMessage: "Add support for more LLM models (#186)",
      commitAuthorName: "Tomaz Bratanic",
      commitAuthorAvtar: "https://avatars.githubusercontent.com/u/19948365?v=4",
      commitDate: "2024-11-05T07:26:39.000Z",
      summary: "gojffdiodhf sgfdhigs iogsg m"
    },
    {
      id:'djj',
      commitMessage: "Add support for more LLM models (#186)",
      commitAuthorName: "Tomaz Bratanic",
      commitAuthorAvtar: "https://avatars.githubusercontent.com/u/19948365?v=4",
      commitDate: "2024-11-05T07:26:39.000Z",
      summary: "gojffdiodhf sgfdhigs iogsg m"
    }
  ],
  prs: [
    {
      pullReqTitle: "fix: Dockerfile to build and pull images.",
      pullReqMessage: "SO: Windows  \r\nDocker and docker compose running on WSL (Ubuntu).\r\n\r\nDocker Version: 26.1.3\r\nDocker Compose version v2.32.4\r\n\r\nThose changes fixed problems to bringing up the database and pull_model services. The other apps didn't run because these dependencies.\r\n\r\nThe order:\r\n\r\n1. docker-compose up llm\r\n2. docker-compose up database pull-model\r\n3. docker-compose up <app>",
      pullReqAuthorName: "leonardovaleriano",
      pullReqAuthorAvtar: "https://avatars.githubusercontent.com/u/9980129?v=4",
      pullReqDate: "2025-01-21T13:26:59.000Z",
      summary: "## PR Summary\n\nThis pull request refactors the `pull_model.clj` script within the Dockerfile to streamline the process of pulling OLLAMA models.  The primary change is moving the `pull_model.clj` logic directly into the `pull_model.Dockerfile`, removing the need for a separate `pull_model.clj` file. This improves the build process and makes the Docker image more compact.\n\n**Specific Changes:**\n\n1. **Removed Separate File:** The previously separate `pull_model.clj` file is now directly embedded in the `pull_model.Dockerfile`. This eliminates the need to copy a separate file into the container.\n\n\n2. **Simplified Entrypoint:**  The `ENTRYPOINT` directive is adjusted to point directly to the embedded Clojure script within the Dockerfile (`pull_model.clj`).\n\n\n3. **Error Handling:** The `try...catch` block within the Clojure code handles potential errors during the OLLAMA model pull process. The `catch` block exits the program if any exceptions occur.\n\n\n\n**Impact on Application Behavior:**\n\nThe change ensures the same OLLAMA model pulling logic is executed as before.  Previously, the separate `pull_model.clj` file would be executed by babashka.  With this change, that functionality is encapsulated into the Dockerfile, resulting in cleaner, more contained model pulling logic within the Docker image.\n\n**Benefits:**\n\n* **Reduced Complexity:** Simplifies the Docker image by combining the model pulling script directly with the Dockerfile.\n* **Improved Build:** The build process is now potentially faster and more efficient due to reduced steps.\n\n**Potential Issues and Future Considerations:**\n\nWhile this refactoring improves the code, the Docker image size remains a potential concern. Future consideration could involve optimizing the build process for minimal image size without impacting functionality or reliability.\n\n\n\n"
    },
    {
      pullReqTitle: "fix: Dockerfile to build and pull images.",
      pullReqMessage: "SO: Windows  \r\nDocker and docker compose running on WSL (Ubuntu).\r\n\r\nDocker Version: 26.1.3\r\nDocker Compose version v2.32.4\r\n\r\nThose changes fixed problems to bringing up the database and pull_model services. The other apps didn't run because these dependencies.\r\n\r\nThe order:\r\n\r\n1. docker-compose up llm\r\n2. docker-compose up database pull-model\r\n3. docker-compose up <app>",
      pullReqAuthorName: "leonardovaleriano",
      pullReqAuthorAvtar: "https://avatars.githubusercontent.com/u/9980129?v=4",
      pullReqDate: "2025-01-21T13:26:59.000Z",
      summary: "## PR Summary\n\nThis pull request refactors the `pull_model.clj` script within the Dockerfile to streamline the process of pulling OLLAMA models.  The primary change is moving the `pull_model.clj` logic directly into the `pull_model.Dockerfile`, removing the need for a separate `pull_model.clj` file. This improves the build process and makes the Docker image more compact.\n\n**Specific Changes:**\n\n1. **Removed Separate File:** The previously separate `pull_model.clj` file is now directly embedded in the `pull_model.Dockerfile`. This eliminates the need to copy a separate file into the container.\n\n\n2. **Simplified Entrypoint:**  The `ENTRYPOINT` directive is adjusted to point directly to the embedded Clojure script within the Dockerfile (`pull_model.clj`).\n\n\n3. **Error Handling:** The `try...catch` block within the Clojure code handles potential errors during the OLLAMA model pull process. The `catch` block exits the program if any exceptions occur.\n\n\n\n**Impact on Application Behavior:**\n\nThe change ensures the same OLLAMA model pulling logic is executed as before.  Previously, the separate `pull_model.clj` file would be executed by babashka.  With this change, that functionality is encapsulated into the Dockerfile, resulting in cleaner, more contained model pulling logic within the Docker image.\n\n**Benefits:**\n\n* **Reduced Complexity:** Simplifies the Docker image by combining the model pulling script directly with the Dockerfile.\n* **Improved Build:** The build process is now potentially faster and more efficient due to reduced steps.\n\n**Potential Issues and Future Considerations:**\n\nWhile this refactoring improves the code, the Docker image size remains a potential concern. Future consideration could involve optimizing the build process for minimal image size without impacting functionality or reliability.\n\n\n\n"
    },
    {
      pullReqTitle: "fix: Dockerfile to build and pull images.",
      pullReqMessage: "SO: Windows  \r\nDocker and docker compose running on WSL (Ubuntu).\r\n\r\nDocker Version: 26.1.3\r\nDocker Compose version v2.32.4\r\n\r\nThose changes fixed problems to bringing up the database and pull_model services. The other apps didn't run because these dependencies.\r\n\r\nThe order:\r\n\r\n1. docker-compose up llm\r\n2. docker-compose up database pull-model\r\n3. docker-compose up <app>",
      pullReqAuthorName: "leonardovaleriano",
      pullReqAuthorAvtar: "https://avatars.githubusercontent.com/u/9980129?v=4",
      pullReqDate: "2025-01-21T13:26:59.000Z",
      summary: "## PR Summary\n\nThis pull request refactors the `pull_model.clj` script within the Dockerfile to streamline the process of pulling OLLAMA models.  The primary change is moving the `pull_model.clj` logic directly into the `pull_model.Dockerfile`, removing the need for a separate `pull_model.clj` file. This improves the build process and makes the Docker image more compact.\n\n**Specific Changes:**\n\n1. **Removed Separate File:** The previously separate `pull_model.clj` file is now directly embedded in the `pull_model.Dockerfile`. This eliminates the need to copy a separate file into the container.\n\n\n2. **Simplified Entrypoint:**  The `ENTRYPOINT` directive is adjusted to point directly to the embedded Clojure script within the Dockerfile (`pull_model.clj`).\n\n\n3. **Error Handling:** The `try...catch` block within the Clojure code handles potential errors during the OLLAMA model pull process. The `catch` block exits the program if any exceptions occur.\n\n\n\n**Impact on Application Behavior:**\n\nThe change ensures the same OLLAMA model pulling logic is executed as before.  Previously, the separate `pull_model.clj` file would be executed by babashka.  With this change, that functionality is encapsulated into the Dockerfile, resulting in cleaner, more contained model pulling logic within the Docker image.\n\n**Benefits:**\n\n* **Reduced Complexity:** Simplifies the Docker image by combining the model pulling script directly with the Dockerfile.\n* **Improved Build:** The build process is now potentially faster and more efficient due to reduced steps.\n\n**Potential Issues and Future Considerations:**\n\nWhile this refactoring improves the code, the Docker image size remains a potential concern. Future consideration could involve optimizing the build process for minimal image size without impacting functionality or reliability.\n\n\n\n"
    }
]
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [mails, setMails] = React.useState(data.mails)
  const [commits,setCommits] = React.useState(data.commits)
  const [prs,setPRs] = React.useState(data.prs)
  const { setOpen } = useSidebar()
  const { user } = useUser();
  const email = user?.emailAddresses 


  const handleNavItemClick = async (item:any) => {
    setActiveItem(item);
    
    // Call the API based on the navMain title and URL
    try {
      const response = await fetch(`http://localhost:8080/v1/api/projects/56a0b301-87ba-4c1c-b5b5-6bd60c6f3f35/${item.url}`,{
        headers:{
          'Authorization': `${email}`
        }
      }); 
      const data = await response.json();

      if (item.title === "Chat") {
        setMails(data.mails || []); // Set mails for Chat
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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
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
                      isActive={activeItem.title === item.title}
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
              {activeItem.title}
            </div>
           <SelectProject/>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
            {activeItem.title === "Chat" }
            {activeItem.title === "PRs" && <PrComponent prs={prs}/> }
            {activeItem.title === "Commits" && <CommitComponent commits={commits} />}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
