'use server'
import {z} from 'zod'
import { currentUser } from '@clerk/nextjs/server'

export async function createProject(prevState: {pending: boolean, message: string},formData: FormData) {
    const scema = z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string()
    })
    try{
        const user = await currentUser();
        const email = user?.emailAddresses[0].emailAddress

        if (!email) {
            return { pending: false, message: "User authentication failed" };
        }

        const parse = scema.safeParse({
            name: formData.get("name"),
            githubUrl: formData.get("githubUrl"),
            githubToken: formData.get("githubToken")
        })

        if (!parse.success) {
            return { pending: false, message: "Invalid form data" };
        }

        const data = parse.data

        try{
            const response = await fetch('https://pullscan.onrender.com/v1/api/projects/create', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email}`
                },
                body: JSON.stringify({
                    name: data?.name,
                    githubUrl: data?.githubUrl,
                    githubToken: data?.githubToken
                })
            })

            

            const result = await response.json()
            if (!result.project?.id) {
                return { pending: false, message: "Project created but ID is missing" };
            }

            // Continue with the rest of the code
            console.log("API Response:", result);
            
            if (!result.project?.id) {
                return { pending: false, message: "Project created but ID is missing" };
            }
            
            return { 
                pending: false, 
                message: "success", 
                projectId: result.project.id
            };
        }
        catch (fetchError) {
            console.error("Fetch error:", fetchError);
            return { 
                pending: false, 
                message: `Network error: Unable to connect to API server. CORS issue or server might be down.` 
            };
        }
    }
    catch(error){
        return { pending: false, message: "An error occurred",error };
    }
}
