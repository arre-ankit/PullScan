import 'dotenv/config';
import { getRunner, Langbase } from 'langbase';
import { pipe_system_prompt } from './prompt';

const langbase = new Langbase({
	apiKey: process.env.LANGBASE_API_KEY!,
});

async function createPipe(pipeName:string,memoryName:string) {
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

async function callpipe(pipeName:string,prompt:string) {
	const { stream } = await langbase.pipe.run({
		name: pipeName,
		stream: true,
		messages: [
			{
				role: `user`,
				content: `${prompt}`,
			},
		],
	});

	const runner = getRunner(stream);
	runner.on('content', content => {
		process.stdout.write(content);
	});

}

async function main() {
    //createPipe('ccb6b329-a7fd-45af-81f5-64f9bd80763a_GENSTACK Final','ccb6b329-a7fd-45af-81f5-64f9bd80763a-gen-stack-final')
    callpipe('ccb6b329-a7fd-45af-81f5-64f9bd80763a-genstack-final','WHat is this repo about')
}

main();