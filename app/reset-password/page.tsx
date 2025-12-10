// app/reset-password/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    // Get the token from URL query parameters
    const token = searchParams.get("token");

    if (!token) {
      toast.error(
        "Invalid or missing reset token. Please request a new reset link."
      );
      setLoading(false);
      return;
    }

    try {
      // Call Better Auth API to reset password
      await resetPassword(values.password, token);

      toast.success("Password reset successfully! Redirecting to sign in...");

      // Redirect to sign-in page after 2 seconds
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.message ??
        "Failed to reset password. The link may have expired.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border-2 border-gray-200 bg-white p-8 shadow-lg">
        {/* <Toaster /> */}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">NEXUS</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Create new password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Resetting password..." : "Reset password"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-600">
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
