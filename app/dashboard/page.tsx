import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardForm } from './DashboardForm'

export default async function DashboardPage() {
  // Get current user
  const user = await getCurrentUser()

  if (!user?.email) {
    redirect('/')
  }

  return <DashboardForm />
}
