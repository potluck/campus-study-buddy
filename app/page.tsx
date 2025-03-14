import { auth } from "./auth"
import Chat from './components/Chat'
import Link from 'next/link'
import Image from 'next/image'
import SignInButton from './components/SignInButton'

export default async function Home() {
  const session = await auth()

  let preferredName = null;
  let lastChatAt = null;
  if (session?.user?.email) {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/update-last-login`, {
      method: 'POST',
      body: JSON.stringify({ email: session.user.email })
    })

    const preferredNameResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/get-user-details`, {
      method: 'POST',
      body: JSON.stringify({ email: session.user.email })
    })

    const preferredNameData = await preferredNameResponse.json()
    preferredName = preferredNameData.preferredName
    lastChatAt = preferredNameData.lastChatAt
  }

  if (!session) {
    return (
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Welcome to Campus Study Buddy</h1>
            <SignInButton />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Chat with your Study Buddy</h1>
          {session?.user && (
            <div className="flex items-center gap-2">
              <Image
                src={session.user.image ?? ''}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>{session.user.name}</span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-red-500 hover:underline"
              >
                Sign out
              </Link>
            </div>
          )}
        </div>
        <Chat email={session?.user?.email ?? ''} googleName={session?.user?.name ?? ''} preferredName={preferredName} lastChatAt={lastChatAt} />
      </main>
    </div>
  )
}
