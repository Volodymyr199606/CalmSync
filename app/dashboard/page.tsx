import { auth, signOut } from "../../auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CalmSync</h1>
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {session.user.name || session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Welcome back!</h2>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Your personalized relaxation dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Get Started</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    How are you feeling today? Let us create a personalized
                    relaxation experience for you.
                  </p>
                  <Button disabled>
                    Start Mood Check-In
                    <span className="ml-2 text-xs">(Coming in Phase 2)</span>
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Your Profile</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {session.user.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {session.user.email}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                  <h3 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-500">
                    ⚠️ Safety Notice
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    CalmSync is not a substitute for professional mental health care.
                    If you&apos;re experiencing a crisis, please contact a mental health
                    professional or emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

