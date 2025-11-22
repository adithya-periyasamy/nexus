"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AppHeader from "./_components/AppHeader";
import AppSidebar from "./_components/AppSidebar";

type Props = {};

const DashboardProvider = ({ children }: any) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <AppHeader />
          {children}
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default DashboardProvider;
