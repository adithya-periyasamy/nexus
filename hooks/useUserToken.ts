"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

interface UserTokenResponse {
  token: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function useUserToken() {
  const { data: session } = authClient.useSession();

  return useQuery<UserTokenResponse>({
    queryKey: ["userToken", session?.user?.id],
    queryFn: async () => {
      const res = await fetch("/api/user/token");

      if (!res.ok) {
        throw new Error("Failed to fetch user token");
      }

      return res.json();
    },
    enabled: !!session?.user, // Only run if user is logged in
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2, // Retry failed requests twice
  });
}
