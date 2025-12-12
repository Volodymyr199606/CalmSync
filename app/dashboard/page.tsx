import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardForm } from './DashboardForm'

export default async function DashboardPage() {
  // Get current user session
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  return <DashboardForm />
}
