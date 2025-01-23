'use client'
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function Projects() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin')
    },
  })    

  if (session) {
    return null
  }

  return (
    <div>
      Project
    </div>
  )
}