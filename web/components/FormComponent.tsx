'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useActionState, useEffect } from "react"
import { createProject } from "@/app/actions"
import { useRouter } from "next/navigation"


type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}


const intialState = {
    pending:false,
    message: '',
    projectId: null
}

export default function FormComponent(){
    const {register} = useForm<FormInput>()
    const [state, formAction, pending] = useActionState(createProject,intialState);
    const router = useRouter();

    useEffect(() => {
        // Log the state to debug
        console.log("Form state:", state);
        
        if (state.message === "success" && state.projectId) {
            console.log("Redirecting to:", `/dashboard/projects/${state.projectId}`);
            router.push(`/dashboard/projects/${state.projectId}`);
        }
    }, [state, router]);


    return(
        <form action={formAction}> 
            <Input {...register('projectName', {required:true})} name="name" required placeholder="Project Name"/>
            <div className="h-2"></div>
            <Input {...register('repoUrl', {required:true})} name="githubUrl" required placeholder="Github URL"/>
            <div className="h-2"></div>
            <Input {...register('githubToken')} name="githubToken" required placeholder="Github Token"/>
            <div className="h-4"></div>
            <p className="text-sm text-muted-foreground">
                Need a token? <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Visit this link</a> to create one.
            </p>
            <Button type="submit" disabled={pending} className="mt-2">Create Project</Button>
        </form>

    )
} 



