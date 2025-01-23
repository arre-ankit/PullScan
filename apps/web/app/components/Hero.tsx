'use client'
import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';


export default function Hero() {
  const session = useSession()
  const router = useRouter()

  return (
    <div>
    <div className="flex flex-col gap-2 min-[400px]:flex-row">
      {session.data?.user ? <button onClick={()=> router.push("/projects")}>Go to Projects</button> 
      : <button onClick={()=> signIn("google") }>Sign In</button>
      }
      <br/>
      {session?.data?.user && 
      <button onClick={()=>signOut()} >Logout</button>}
    </div>
    </div>
  );
}