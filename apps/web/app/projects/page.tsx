'use client'
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function Projects() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin')
    },
  });

  // If session is loading, return null or a loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const callApi = async () => {
    try {
      // Access the token from the session
      const email = session.user?.email;

      const response = await fetch('http://localhost:8080/api/v1/project/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${email}` // Include the token in the Authorization header
        },
        credentials: 'include',
        body: JSON.stringify({
          name: "My Project",
          githubUrl: "https://github.com/myproject",
          githubToken: "your_github_token" // Optional
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data); // Log the response data
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  return (
    <div>
      <button onClick={callApi}>Create Project</button>
    </div>
  );
}
