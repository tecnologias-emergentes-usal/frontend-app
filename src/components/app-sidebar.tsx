"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, Bell, Activity, LifeBuoy, Settings2 } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavCameras } from "@/components/nav-cameras"
import { getSidebarCameras } from "@/config/cameras"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { PaperPlaneIcon } from "@radix-ui/react-icons"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Principal",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Alertas",
      url: "#",
      icon: Bell,
    },
    {
      title: "Predicciones",
      url: "#",
      icon: Activity,
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Equipo", url: "#" },
        { title: "Facturación", url: "#" },
        { title: "Límites", url: "#" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Soporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Comentarios",
      url: "#",
      icon: PaperPlaneIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const cameras = React.useMemo(() => getSidebarCameras(), [])
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                  <Image src="/images/icon.png" alt="USAL" width={16} height={16} className="object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">USAL</span>
                  <span className="truncate text-xs">Universidad del Salvador</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCameras cameras={cameras as any} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
