// app/forgot-password/page.tsx
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
import { forgotPassword } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      // Call Better Auth API to send reset email
      await forgotPassword(values.email);

      setUserEmail(values.email);
      setEmailSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  // Show success message after email is sent
  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border-2 border-gray-200 bg-white p-8 shadow-lg text-center">
          {/* <Toaster /> */}

          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
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

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {userEmail}
            </p>
          </div>

          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Next steps:</strong>
            </p>
            <ol className="mt-2 text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the reset password link</li>
              <li>Enter your new password</li>
            </ol>
            <p className="mt-2 text-xs text-blue-600">
              The link will expire in 1 hour.
            </p>
          </div>

          <Link href="/sign-in" className="block">
            <Button variant="outline" className="w-full cursor-pointer">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show the forgot password form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border-2 border-gray-200 bg-white p-8 shadow-lg">
        {/* <Toaster /> */}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">NEXUS</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
