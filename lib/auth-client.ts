import { createAuthClient } from "better-auth/react";
const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
});
const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
};

// built-in BetterAuth API methods

// Forgot Password - sends reset email
const forgotPassword = async (email: string) => {
  return await authClient.forgetPassword({
    email: email,
    redirectTo: "/reset-password",
  });
};

// Reset Password - updates the password in the database

const resetPassword = async (newPassword: string, token: string) => {
  return await authClient.resetPassword({
    newPassword: newPassword,
    token: token,
  });
};

export { authClient, forgotPassword, resetPassword, signIn };
