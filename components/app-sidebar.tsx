"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "@/lib/auth-client"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

type SidebarMode = 'default' | 'admin' | 'worker';

const navConfig: Record<
    SidebarMode,
    {
        navMain: {
            title: string;
            url: string;
            icon: React.ComponentType<{ className?: string }>;
        }[];
        navSecondary: {
            title: string;
            url: string;
            icon: React.ComponentType<{ className?: string }>;
        }[];
        documents?: {
            name: string;
            url: string;
            icon: React.ComponentType<{ className?: string }>;
        }[];
    }
> = {
    default: {
        navMain: [
            { title: 'Dashboard', url: '/dashboard', icon: IconDashboard },
            { title: 'Lifecycle', url: '#', icon: IconListDetails },
            { title: 'Analytics', url: '#', icon: IconChartBar },
            { title: 'Projects', url: '#', icon: IconFolder },
            { title: 'Team', url: '#', icon: IconUsers },
        ],
        navSecondary: [
            { title: 'Settings', url: '#', icon: IconSettings },
            { title: 'Get Help', url: '#', icon: IconHelp },
            { title: 'Search', url: '#', icon: IconSearch },
        ],
        documents: [
            { name: 'Data Library', url: '#', icon: IconDatabase },
            { name: 'Reports', url: '#', icon: IconReport },
            { name: 'Word Assistant', url: '#', icon: IconFileWord },
        ],
    },
    admin: {
        navMain: [
            { title: 'Dashboard', url: '/admin/dashboard', icon: IconDashboard },
            { title: 'Projects', url: '/admin/projects', icon: IconFolder },
            { title: 'Create Task', url: '/admin/tasks/new', icon: IconListDetails },
            { title: 'Workers', url: '/admin/workers', icon: IconUsers },
            { title: 'Time Analytics', url: '/admin/analytics', icon: IconChartBar },
            { title: 'AI Reports', url: '/admin/reports', icon: IconFileAi },
        ],
        navSecondary: [
            { title: 'Settings', url: '/admin/settings', icon: IconSettings },
            { title: 'Get Help', url: '#', icon: IconHelp },
            { title: 'Search', url: '#', icon: IconSearch },
        ],
        documents: [
            { name: 'Project Library', url: '#', icon: IconDatabase },
            { name: 'Report Archive', url: '/admin/reports', icon: IconReport },
        ],
    },
    worker: {
        navMain: [
            { title: 'My Dashboard', url: '/worker', icon: IconDashboard },
            { title: 'My Tasks', url: '/worker/tasks', icon: IconListDetails },
            { title: 'Time Entries', url: '/worker/time', icon: IconChartBar },
            { title: 'AI Insights', url: '/worker/insights', icon: IconFileAi },
        ],
        navSecondary: [
            { title: 'Profile', url: '/worker/profile', icon: IconUsers },
            { title: 'Help Center', url: '#', icon: IconHelp },
            { title: 'Settings', url: '/worker/settings', icon: IconSettings },
        ],
        documents: undefined,
    },
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    mode?: SidebarMode;
}

export function AppSidebar({ mode = 'default', ...props }: AppSidebarProps) {
  const { data: session } = useSession()

  const userData = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email,
    avatar: session.user.image || "/codeguide-logo.png",
  } : {
    name: "Guest",
    email: "guest@example.com", 
    avatar: "/codeguide-logo.png",
  }

  const config = navConfig[mode] ?? navConfig.default;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image src="/codeguide-logo.png" alt="CodeGuide" width={32} height={32} className="rounded-lg" />
                <span className="text-base font-semibold font-parkinsans">CodeGuide</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={config.navMain} />
        {config.documents ? (
          <NavDocuments items={config.documents} />
        ) : null}
        <NavSecondary items={config.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
