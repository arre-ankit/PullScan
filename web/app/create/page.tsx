import FormComponent from "@/components/FormComponent"


export default function CreatePage(){
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>
                <div>
                    <h1 className="font-semibold text-3xl">
                        Link Your Github Repo
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the URL of your repo
                    </p>
                </div>
                <div className="h-4 flex"></div>
                <FormComponent/>
                <div>
                </div>
            </div>
        </div>
    )
}