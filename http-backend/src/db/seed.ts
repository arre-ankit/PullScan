import { prismaClient } from ".";


async function seedProjects() {
  const projects = [
    {
      id:"1b601890-b9d5-4bfe-a9f8-2ab22f797b4b",
      createdAt:"2025-02-19T22:11:08.770Z",
      updatedAt:"2025-02-19T22:11:08.770Z",
      name:"Gen Stack",
      githubUrl:"https://github.com/docker/genai-stack",
      deletedAt:null,
      userToProject:[{"id":"41891366-e9f0-4b08-a952-3ae496502bda"}],
      commits:[],
      sourceCodeEmbeddings:[],
      savedQuestion:[],
      pullrequests:[]
    },
    {
        id:"1b601890-b9d5-4bfe-a9f8-2ab2ffff97b4b",
        createdAt:"2025-02-19T22:11:08.770Z",
        updatedAt:"2025-02-19T22:11:08.770Z",
        name:"CMS",
        githubUrl:"https://github.com/code100x/cms",
        deletedAt:null,
        userToProject:[{"id":"1"}],
        commits:[],
        sourceCodeEmbeddings:[],
        savedQuestion:[],
        pullrequests:[]
    }
  ];

  try {
    const existingCourses = await prismaClient.project.findMany();
    if (existingCourses.length > 0) {
      console.error('DB is already seeded with courses.');
      return;
    }

    await prismaClient.project.createMany({ data: projects });
  } catch (error) {
    console.error('Error seeding courses:', error);
    throw error;
  }
}

async function seedPrs() {
    const projects = [
      {
        id:"1b601890-b9d5-4bfe-a9f8-2ab22f797b4b",
        createdAt:"2025-02-19T22:11:08.770Z",
        updatedAt:"2025-02-19T22:11:08.770Z",
        name:"Gen Stack",
        githubUrl:"https://github.com/docker/genai-stack",
        deletedAt:null,
        userToProject:[{"id":"41891366-e9f0-4b08-a952-3ae496502bda"}],
        commits:[],
        sourceCodeEmbeddings:[],
        savedQuestion:[],
        pullrequests:[]
      },
      {
          id:"1b601890-b9d5-4bfe-a9f8-2ab2ffff97b4b",
          createdAt:"2025-02-19T22:11:08.770Z",
          updatedAt:"2025-02-19T22:11:08.770Z",
          name:"CMS",
          githubUrl:"https://github.com/code100x/cms",
          deletedAt:null,
          userToProject:[{"id":"1"}],
          commits:[],
          sourceCodeEmbeddings:[],
          savedQuestion:[],
          pullrequests:[]
      }
    ];
  
    try {
      const existingCourses = await prismaClient.project.findMany();
      if (existingCourses.length > 0) {
        console.error('DB is already seeded with courses.');
        return;
      }
  
      await prismaClient.project.createMany({ data: projects });
    } catch (error) {
      console.error('Error seeding courses:', error);
      throw error;
    }
}
  
async function seedCommits() {
    const projects = [
      {
        id:"1b601890-b9d5-4bfe-a9f8-2ab22f797b4b",
        createdAt:"2025-02-19T22:11:08.770Z",
        updatedAt:"2025-02-19T22:11:08.770Z",
        name:"Gen Stack",
        githubUrl:"https://github.com/docker/genai-stack",
        deletedAt:null,
        userToProject:[{"id":"41891366-e9f0-4b08-a952-3ae496502bda"}],
        commits:[],
        sourceCodeEmbeddings:[],
        savedQuestion:[],
        pullrequests:[]
      },
      {
          id:"1b601890-b9d5-4bfe-a9f8-2ab2ffff97b4b",
          createdAt:"2025-02-19T22:11:08.770Z",
          updatedAt:"2025-02-19T22:11:08.770Z",
          name:"CMS",
          githubUrl:"https://github.com/code100x/cms",
          deletedAt:null,
          userToProject:[{"id":"1"}],
          commits:[],
          sourceCodeEmbeddings:[],
          savedQuestion:[],
          pullrequests:[]
      }
    ];
  
    try {
      const existingCourses = await prismaClient.project.findMany();
      if (existingCourses.length > 0) {
        console.error('DB is already seeded with courses.');
        return;
      }
  
      await prismaClient.project.createMany({ data: projects });
    } catch (error) {
      console.error('Error seeding courses:', error);
      throw error;
    }
}
  
async function seedUsertoProject() {
    const projects = [
      {
        id:"1b601890-b9d5-4bfe-a9f8-2ab22f797b4b",
        createdAt:"2025-02-19T22:11:08.770Z",
        updatedAt:"2025-02-19T22:11:08.770Z",
        name:"Gen Stack",
        githubUrl:"https://github.com/docker/genai-stack",
        deletedAt:null,
        userToProject:[{"id":"41891366-e9f0-4b08-a952-3ae496502bda"}],
        commits:[],
        sourceCodeEmbeddings:[],
        savedQuestion:[],
        pullrequests:[]
      },
      {
          id:"1b601890-b9d5-4bfe-a9f8-2ab2ffff97b4b",
          createdAt:"2025-02-19T22:11:08.770Z",
          updatedAt:"2025-02-19T22:11:08.770Z",
          name:"CMS",
          githubUrl:"https://github.com/code100x/cms",
          deletedAt:null,
          userToProject:[{"id":"1"}],
          commits:[],
          sourceCodeEmbeddings:[],
          savedQuestion:[],
          pullrequests:[]
      }
    ];
  
    try {
      const existingCourses = await prismaClient.project.findMany();
      if (existingCourses.length > 0) {
        console.error('DB is already seeded with courses.');
        return;
      }
  
      await prismaClient.project.createMany({ data: projects });
    } catch (error) {
      console.error('Error seeding courses:', error);
      throw error;
    }
}
  