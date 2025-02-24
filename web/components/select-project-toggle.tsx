"use client"

import React, { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { useUser } from "@clerk/nextjs"



interface Project {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  name: string;
  githubUrl: string;
  deletedAt: string | null;
}

interface SelectProjectToggleProps {
  onProjectSelect: (projectId: string) => void;
}

const SelectProjectToggle:any = ({ onProjectSelect }:SelectProjectToggleProps) => {
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentprojectName,setcurrentprojectName] = useState("Select project...")

  React.useEffect(() => {
    if (!email) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://ec2-3-110-45-72.ap-south-1.compute.amazonaws.com:8080/v1/api/projects`, {
          headers: {
            'Authorization': email
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [email]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
        >
          {currentprojectName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search project..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <CommandItem disabled>Loading...</CommandItem>
              ) : projects.length === 0 ? (
                <CommandItem disabled>No projects available</CommandItem>
              ) : (
                projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.name}
                    onSelect={(currentValue) => {
                      const selectedProject = projects.find(p => p.name === currentValue);
                      if (selectedProject) {
                        setValue(currentValue === value ? "" : currentValue);
                        setcurrentprojectName(selectedProject.name)
                        onProjectSelect(selectedProject.id);
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === project.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {project.name}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectProjectToggle;