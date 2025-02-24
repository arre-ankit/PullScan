import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "@/components/ui/textarea"

interface Prop {
    projectId: string | string[]|undefined
}

export function ChatBox({projectId}:Prop) {
    const [question,setQuestion] = useState('')
    const [loading,setloading] = useState(false)


    const handleQuestion = async (question:string) => {
        try{
            setloading(true)
            await fetch(`http://localhost:8080/v1/api/projects/${projectId}/question`,{
                method: 'POST',
                headers:{
                  'Authorization': `ankit992827@gmail.com`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({prompt: question})
            });
            setloading(false)
        } 
        catch(error){
            console.log(error)
        }
    }

  return (
    <div>
    <Card className=" relative col-span-3">
        <CardHeader>
            <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={async()=>{await handleQuestion(question)}}>
                <Textarea placeholder="Which file should I edit to change the home page" value={question} onChange={(e)=>setQuestion(e.target.value)}/>
                <div className="h-4"></div>
                    <Button disabled={loading} type="submit">
                        Ask AI
                    </Button>
            </form>
        </CardContent>
    </Card>
    </div>
  )
}
