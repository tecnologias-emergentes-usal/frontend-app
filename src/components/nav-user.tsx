"use client"

import * as React from "react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserButton, useUser } from "@clerk/nextjs"

export function NavUser() {
  const { user } = useUser()
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Usuario"
  const email = user?.primaryEmailAddress?.emailAddress || ""
  const avatar = user?.imageUrl || ""
  const fallback = `${user?.firstName?.charAt(0) ?? "U"}${user?.lastName?.charAt(0) ?? ""}`.toUpperCase()

  const userBtnWrapperRef = React.useRef<HTMLSpanElement | null>(null)

  const triggerUserMenu = React.useCallback(() => {
    const btn = userBtnWrapperRef.current?.querySelector("button") as HTMLButtonElement | null
    btn?.click()
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      triggerUserMenu()
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="px-2 py-1.5">
          <SidebarMenuButton
            size="lg"
            className="relative"
            onClick={triggerUserMenu}
            onKeyDown={onKeyDown}
            aria-label="Abrir menú de usuario"
          >
            <div className="relative flex w-full items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={fullName} />
                <AvatarFallback className="rounded-lg">{fallback}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{fullName}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              {/* Hidden trigger kept aligned (no pointer events) */}
              <span ref={userBtnWrapperRef} className="pointer-events-none absolute inset-0 -z-10">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonTrigger: "h-full w-full",
                      userButtonAvatarBox: "hidden",
                    },
                  }}
                />
              </span>
            </div>
          </SidebarMenuButton>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
