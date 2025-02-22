import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "@/components/ui/textarea"

export function ChatComponent({prs}:any) {
    const [question,setQuestion] = useState('')
    const [loading,setLoading] = useState(false);

  return (
    <>
        <Card className=" relative col-span-3">
            <CardHeader>
                <CardTitle>Ask a question</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <Textarea placeholder="Which file should I edit to change the home page" value={question} onChange={(e)=>setQuestion(e.target.value)}/>
                    <div className="h-4"></div>
                        <Button disabled={loading}  type="submit">
                            Ask AI
                        </Button>
                </form>
            </CardContent>
        </Card>


    </>
  )
}
