"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SafeMixLogo from "@/components/ui/Logo";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  Share2,
  Settings,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { label: "Overview",       href: "/dashboard",                  icon: LayoutDashboard, exact: true },
  { label: "Add Medicine",   href: "/dashboard/add-medicine",     icon: PlusCircle,      exact: false },
  { label: "Reminders",      href: "/dashboard/reminders",        icon: Bell,            exact: false },
  { label: "Reports",        href: "/dashboard/reports",          icon: FileText,        exact: false },
  { label: "Doctor Share",   href: "/dashboard/doctor-share",     icon: Share2,          exact: false },
  { label: "Report Adverse", href: "/dashboard/adverse-event",    icon: AlertOctagon,    exact: false },
  { label: "Settings",       href: "/dashboard/settings",         icon: Settings,        exact: false },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-[#141a15] border-r border-[#e0e8e2] dark:border-white/10 transition-all duration-300 md:relative md:translate-x-0 ${
          collapsed ? "md:w-[68px]" : "md:w-60"
        } ${mobileOpen ? "translate-x-0 w-60" : "-translate-x-full w-60 md:translate-x-0"}`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#e0e8e2] dark:border-white/10">
          {collapsed ? (
            <Link href="/" className="flex items-center justify-center mx-auto">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#dceae0]">
                <Image
                  src="/safemix-logo.jpg"
                  alt="SafeMix"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  style={{ mixBlendMode: "multiply" }}
                  priority
                />
              </div>
            </Link>
          ) : (
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <SafeMixLogo size={30} textSize="text-base" />
            </Link>
          )}

          {/* Close button for mobile */}
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-[#9ab0a0] hover:bg-[#f0f5f1] dark:hover:bg-[#1e2820] md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {links.map(({ label, href, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-[#f0f8f2] dark:bg-[#1e2820] text-[#42594A] dark:text-[#b5ccba]"
                    : "text-[#52615a] dark:text-[#7a9080] hover:bg-[#f4f8f5] dark:hover:bg-[#1a2218] hover:text-[#42594A] dark:hover:text-[#9ab0a0]"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    active ? "text-[#5E7464]" : "text-[#9ab0a0] group-hover:text-[#5E7464]"
                  }`}
                />
                <span className={`${collapsed ? "md:hidden" : "block"}`}>{label}</span>
                {active && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5E7464]" />}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button (Desktop Only) */}
        <div className="p-3 border-t border-[#e0e8e2] dark:border-white/10 hidden md:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded-xl text-[#9ab0a0] hover:bg-[#f0f5f1] dark:hover:bg-[#1e2820] hover:text-[#5E7464] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
