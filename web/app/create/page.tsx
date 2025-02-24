'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs';
import { useState } from "react"
import { useRouter } from "next/navigation";

type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}

export default function  CreatePage(){
    const { user } = useUser(); 
    const email = user?.emailAddresses[0]?.emailAddress; // Extract the email
    const {register,handleSubmit} = useForm<FormInput>()
    const [loading, setloading] = useState(false);
    const router  = useRouter()


    async function onSubmit(data: FormInput) {
        setloading(true)
        await fetch('http://localhost:8080/v1/api/projects/create', { // Adjust the endpoint as necessary
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${email}` // Replace with actual token if needed
            },
            body: JSON.stringify({
                name: data.projectName,
                githubUrl: data.repoUrl,
                githubToken: data.githubToken
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create project');
            }
            return response.json();
        })
        .then((data) => {
            toast.success('Project created successfully');
            setloading(false)
            router.push(`/dashboard/projects/${data.project.id}`);
        })
        .catch(() => {
            toast.error('Failed to create project');
            setloading(false)
        });
        return true;
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>
                <div>
                    <h1 className="font-semibold text-2xl">
                        Link Your Github Repo
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the URL of your repo
                    </p>
                </div>
                <div className="h-4 flex"></div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input {...register('projectName', {required:true})} required placeholder="Project Name"/>
                        <div className="h-2"></div>
                        <Input {...register('repoUrl', {required:true})} required placeholder="Github URL"/>
                        <div className="h-2"></div>
                        <Input {...register('githubToken')} placeholder="Github Token (Optional)"/>
                        <div className="h-4"></div>
                        <Button type="submit" disabled={loading}>Create Project</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}