import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { uploadMemoryDocument } from "../langbase/memory"


export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || process.env.GITHUB_TOKEN,
        branch: 'main',
        ignoreFiles: ['package-lock.json', 
            'yarn.lock',
            'pnpm-lock.yaml',
            'bun.lockb',
            '.dockerignore',
            'Dockerfile',
            'LICENSE',
            '.gitignore'],
        recursive: true,
        'unknown': 'warn',
        'maxConcurrency': 5
    })

    const docs = await loader.load()
    return docs
}



export const indexGithubRepo = async (projectId :string, githubUrl:string, name:string, githubToken?:string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken)
    let i = 0;
    for (const doc of docs) {
        console.log(`Doc uploading ${i}`)
        i++;
        console.log(doc?.metadata?.source)
        console.log(typeof(doc.pageContent))
        await uploadMemoryDocument(name, (doc.pageContent) as string, (doc?.metadata?.source)as string)
    }

    
}

// async function main(){
//     const githubToken = process.env.GITHUB_TOKEN
//     const docs = await loadGithubRepo('https://github.com/docker/genai-stack', githubToken)
    
//     for (const doc of docs) {
//         await uploadMemoryDocument('ankit-life', (docs[5].pageContent) as string)
//     }

// }

// main()





// async function main(){
//     const githubToken = process.env.GITHUB_TOKEN
//     console.log(await indexGithubRepo('d','https://github.com/docker/genai-stack','abc', githubToken))
// }

// main()


// Document {
//     pageContent: "<div class=\"w-full h-full\">\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"\n        ><g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\" /><g\n            id=\"SVGRepo_tracerCarrier\"\n            stroke-linecap=\"round\"\n            stroke-linejoin=\"round\"\n        /><g id=\"SVGRepo_iconCarrier\">\n            <g id=\"Interface / External_Link\">\n                <path\n                    id=\"Vector\"\n                    d=\"M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11\"\n                  
//   stroke-width=\"1\"\n                    stroke-linecap=\"round\"\n                    stroke-linejoin=\"round\"\n                />\n            </g>\n        </g></svg\n    >\n</div>\n\n<style>\n    svg {\n        stroke: var(--color, #000);\n    }\n    svg:hover {\n        stroke: var(--hover-color, #000);\n    }\n</style>\n",
//     metadata: {
//       source: "front-end/src/lib/External.svelte",
//       repository: "https://github.com/docker/genai-stack",
//       branch: "main",
//     },
//     id: undefined,


// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// const loader = new PDFLoader("src/document_loaders/sci_adv.pdf", {
//     parsedItemSeparator: "",
//   });
  
//   async function main(){
//     const docs = await loader.load();
//     console.log(docs)
//   }

//   main()

