import { signIn } from "../auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CalmSync</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your personal relaxation companion
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link to sign in. No password needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData: FormData) => {
                "use server";
                const email = formData.get("email") as string;
                await signIn("resend", { email, redirectTo: "/dashboard" });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Magic Link
              </Button>
            </form>

            <div className="mt-6 text-sm text-muted-foreground text-center">
              <p className="font-semibold mb-2">⚠️ Safety Notice</p>
              <p className="text-xs">
                CalmSync is not a substitute for professional mental health care.
                If you&apos;re experiencing a crisis, please contact a mental health professional
                or emergency services immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

