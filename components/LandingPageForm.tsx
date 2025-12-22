"use client";

import { useState } from "react";
import { submitEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LandingPageFormProps {
  onSuccessChange?: (isSuccess: boolean) => void;
}

export function LandingPageForm({ onSuccessChange }: LandingPageFormProps) {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("email", email);
      const result = await submitEmail(formData);
      
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
        onSuccessChange?.(false);
      } else if (result?.success) {
        setIsSuccess(true);
        setIsPending(false);
        onSuccessChange?.(true);
      }
    } catch (err) {
      // If signIn redirects, it throws - treat as success
      setIsSuccess(true);
      setIsPending(false);
      onSuccessChange?.(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center animate-fade-up">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-4">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Check your email
        </h2>
        <p className="text-sm text-muted-foreground">
          We've sent a magic link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-foreground"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
          className="w-full"
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        size="lg"
        className="w-full bg-[#5C926A] hover:bg-[#4d7a5a] text-white"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
}
