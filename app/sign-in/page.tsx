"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
} from "lucide-react";

import { AuthScreen } from "@/components/ui/login-signup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Sign in failed");
      } else {
        if (rememberMe && typeof window !== "undefined") {
          window.localStorage.setItem("worker-tracker:last-email", email);
        }
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreen
      title="Welcome back"
      description="Sign in to your Worker Tracker account"
      footer={
        <div className="flex items-center justify-center gap-1">
          <span>Don’t have an account?</span>
          <Link href="/sign-up" className="text-zinc-200 hover:underline">
            Create one
          </Link>
        </div>
      }
      headerAction={
        <Button
          asChild
          variant="outline"
          className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-900/80"
        >
          <Link href="/worker">View worker portal</Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-zinc-300">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="h-11 border-zinc-800 bg-zinc-950 pl-10 text-zinc-50 placeholder:text-zinc-600"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-zinc-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-11 border-zinc-800 bg-zinc-950 pl-10 pr-12 text-zinc-50 placeholder:text-zinc-600"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-zinc-400 hover:text-zinc-200"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-zinc-400">
            <Checkbox
              id="remember"
              className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setRememberMe(checked === true)
              }
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-zinc-300 transition hover:text-zinc-100"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-lg bg-zinc-50 text-zinc-900 transition hover:bg-zinc-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 inline-flex size-4 animate-spin rounded-full border-[2px] border-zinc-800 border-t-transparent" />
              Signing in
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>

        <div className="relative">
          <Separator className="bg-zinc-800" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900/70 px-2 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            OR
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900/80"
            disabled={isLoading}
          >
            <Github className="mr-2 size-4" />
            GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900/80"
            disabled={isLoading}
          >
            <Chrome className="mr-2 size-4" />
            Google
          </Button>
        </div>
      </form>
    </AuthScreen>
  );
}
