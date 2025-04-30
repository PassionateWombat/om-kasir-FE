"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

const data = {
  teams: [
    {
      name: "Toko Ban Makmur Jaya",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Item",
      href: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Add Product",
          href: "/dashboard/product",
        },
        {
          title: "Product List",
          href: "/dashboard/productlist",
        },
      ],
    },
    {
      title: "Payment",
      href: "#",
      icon: Bot,
      items: [
        {
          title: "Transaction",
          href: "#",
        },
        {
          title: "Add Payment",
          href: "#",
        },
      ],
    },
    {
      title: "Sales",
      href: "#",
      icon: BookOpen,
      items: [
        {
          title: "Sales Overview",
          href: "#",
        },
      ],
    },
    {
      title: "Settings",
      href: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          href: "#",
        },
        {
          title: "Team",
          href: "#",
        },
        {
          title: "Billing",
          href: "#",
        },
        {
          title: "Limits",
          href: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      href: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      href: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      href: "#",
      icon: Map,
    },
  ],
};



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data: session} = useSession();

  const user = {
    email: session?.user?.email ?? "guest@example.com",
    name: session?.user?.name ?? "namasss",
    avatar: "CN",

  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
