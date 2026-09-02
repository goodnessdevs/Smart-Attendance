"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NAV_ITEMS } from "@/config/navigation";
import { useLogoutAction } from "@/features/auth/components/logout-button";
import type { Role } from "@/features/auth/types";

/**
 * One sidebar for all three roles, driven by NAV_ITEMS.
 *
 * Replaces AppSidebar, LecturerSidebar, AdminSidebar and their three mobile
 * navbar counterparts — six components that were the same markup with
 * different arrays, and had drifted apart.
 */
export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const { logout, isPending } = useLogoutAction();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-1.5">
          <Image
            src="/funaab.png"
            alt=""
            width={28}
            height={28}
            className="shrink-0 object-contain"
          />
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            Smart Attendance
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS[role].map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              disabled={isPending}
              tooltip="Logout"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
              <span>{isPending ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
