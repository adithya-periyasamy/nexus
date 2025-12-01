"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserToken } from "@/hooks/useUserToken";
import {
  Database,
  Gem,
  Headphones,
  LayoutDashboard,
  User,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuOptions = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Agents",
    url: "/dashboard/myagents",
    icon: Headphones,
  },
  {
    title: "Data",
    url: "#",
    icon: Database,
  },
  {
    title: "Pricing",
    url: "#",
    icon: WalletCards,
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
];

const AppSidebar = () => {
  const { open } = useSidebar();
  const { data, isLoading, error } = useUserToken();
  const path = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 items-center">
          <Image src={"/logo.svg"} alt="Logo" width={35} height={35} />
          {open && <h2 className="text-xl font-bold">NEXUS</h2>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    size={open ? "lg" : "default"}
                    isActive={path === menu.url}
                  >
                    <Link href={menu.url}>
                      <menu.icon />
                      <span>{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-10">
        <div className="flex gap-2 items-center">
          <Gem />
          {open && (
            <h2>
              Remaining Credits:{" "}
              <span className="font-bold">
                {data?.token?.toLocaleString() || "loading..."}
              </span>
            </h2>
          )}
        </div>
        {open && <Button>Upgrade to Unlimited</Button>}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
