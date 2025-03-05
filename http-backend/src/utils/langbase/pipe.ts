import 'dotenv/config';
import { getRunner, Langbase } from 'langbase';
import { pipe_system_prompt } from './prompt';
import { prismaClient } from '../../db';
import { Response } from 'express';

const langbase = new Langbase({
	apiKey: process.env.LANGBASE_API_KEY!,
});

export async function createPipe(pipeName:string,memoryName:string) {
	const chatAgent = await langbase.pipe.create({
		name: pipeName,
		description: `An AI agent to ask question from the codebase.`,
		messages: [
			{
				role: `system`,
				content: `${pipe_system_prompt}`,
			},
		],
		memory: [{ name: memoryName }],
	});
    console.log('Question agent:', chatAgent);
    return chatAgent
}


export async function streamLangbaseResponse(prompt: string, res: Response, options: {
    pipeName: string,
    projectId: string,
    prompt: string,
    userId: string
  }) {
    // Initialize Langbase
    const langbase = new Langbase({
      apiKey: process.env.LANGBASE_API_KEY!,
    });
  
    // Store the complete answer for saving later
    let completeAnswer = '';
  
    // Run the pipe
    const { stream } = await langbase.pipe.run({
		name: options.pipeName,
		stream: true,
		messages: [
			{
				role: `user`,
				content: `${prompt}`,
			},
		],
	});
  
    // Set up the runner to handle the stream
    const runner = getRunner(stream);
    
    // Handle content chunks
    runner.on('content', content => {
      // Send chunk to client
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
      
      // Accumulate the complete answer
      completeAnswer += content;
    });
  
    // Handle stream end
    runner.on('end', async () => {
      // Save the complete answer to the database
        await prismaClient.question.create({
            data: {
                project: { connect: { id: options.projectId } },
                question: options.prompt,
                answer: completeAnswer
            }
        });
      
    //   // End the response
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    });
  
    // Handle errors
    runner.on('error', error => {
      console.error("Streaming error:", error);
      res.write(`data: ${JSON.stringify({ error: "An error occurred during streaming" })}\n\n`);
      res.end();
    });
  }


// export async function callpipe(pipeName:string,prompt:string,options: {
//     projectId: string,
//     prompt: string,
//     userId: string
//   }) {
// 	const { stream } = await langbase.pipe.run({
// 		name: pipeName,
// 		stream: true,
// 		messages: [
// 			{
// 				role: `user`,
// 				content: `${prompt}`,
// 			},
// 		],
// 	});

//     let completeAnswer = '';

// 	const runner = getRunner(stream);
// 	runner.on('content', content => {
// 		process.stdout.write(content);
// 	});

//     runner.on('end', async () => {
//         // Save the complete answer to the database
//           await prismaClient.question.create({
//               data: {
//                   project: { connect: { id: options.projectId } },
//                   question: options.prompt,
//                   answer: completeAnswer,
//                   user: { connect: { id: options.userId } }
//               }
//           });
//       });
// }
// async function main() {
//     //createPipe('ccb6b329-a7fd-45af-81f5-64f9bd80763a_GENSTACK Final','ccb6b329-a7fd-45af-81f5-64f9bd80763a-gen-stack-final')
//     callpipe('ccb6b329-a7fd-45af-81f5-64f9bd80763a-genstack-final','WHat is this repo about')
// }

// main();