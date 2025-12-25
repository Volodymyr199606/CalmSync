import { prisma } from '@/lib/prisma'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export async function syncSupabaseUserToPrisma(supabaseUser: SupabaseUser) {
  // Check if user exists in Prisma
  let prismaUser = await prisma.user.findUnique({
    where: { email: supabaseUser.email! },
  })

  if (!prismaUser) {
    // Create new user in Prisma
    prismaUser = await prisma.user.create({
      data: {
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
        image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
        emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
      },
    })
  } else {
    // Update existing user if needed
    prismaUser = await prisma.user.update({
      where: { id: prismaUser.id },
      data: {
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || prismaUser.name,
        image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || prismaUser.image,
        emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : prismaUser.emailVerified,
      },
    })
  }

  return prismaUser
}

