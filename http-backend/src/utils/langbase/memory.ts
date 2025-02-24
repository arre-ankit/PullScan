import {Langbase} from 'langbase';

const langbase = new Langbase({
	apiKey: process.env.LANGBASE_API_KEY!
});

export async function listMemory() {
	const url = 'https://api.langbase.com/v1/memory';

	const apiKey = process.env.LANGBASE_API_KEY!

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	});

	const memory = await response.json();
	return memory;
}


export async function createMemory(name:string) {
	const url = 'https://api.langbase.com/v1/memory';

	const apiKey = process.env.LANGBASE_API_KEY!

	const memory = {
		name: name,
		description: 'This is a memory for ai-agent',
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify(memory),
	});

	const newMemory = await response.json();
    console.log(newMemory)
	return newMemory;
}


export async function uploadMemoryDocument(memoryName:string,file:string,fileName:string) {
	console.log(memoryName)
	const fileNamee = fileName.replace(/[\/\.]/g, '_') + '.md';
	console.log(fileNamee)
	const fileBuffer = Buffer.from(file);
	const hasDocumentUploaded = await langbase.memory.documents.upload({
		memoryName: memoryName,
		contentType: 'text/plain',
		documentName: fileNamee,
		document: fileBuffer
	});

	if (hasDocumentUploaded.ok) {
		console.log('Document uploaded successfully');
	}

	return hasDocumentUploaded


}
