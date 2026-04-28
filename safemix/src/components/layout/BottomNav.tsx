"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, FileText, Bell, Settings } from "lucide-react";

const navItems = [
  { name: "Home",      href: "/dashboard",               icon: Home },
  { name: "Add",       href: "/dashboard/add-medicine",  icon: PlusCircle },
  { name: "Reminders", href: "/dashboard/reminders",      icon: Bell },
  { name: "Reports",   href: "/dashboard/reports",        icon: FileText },
  { name: "Settings",  href: "/dashboard/settings",       icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E3E2E0] flex items-center justify-around px-2 z-50 pb-safe shadow-[0_-4px_24px_rgba(70,91,76,0.06)]">
      {navItems.map((item) => {
        // Mark active for the item and any sub-routes (e.g. /dashboard/add-medicine/xxx)
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center w-full h-full gap-1"
          >
            <div
              className={`relative flex items-center justify-center w-10 h-8 rounded-full transition-colors duration-200 ${ isActive ? "bg-[#D0E9D5] text-[#0B1F14] " : "text-[#737873] " }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
            </div>
            <span
              className={`text-[10px] font-semibold transition-colors duration-200 ${ isActive ? "text-[#0B1F14] " : "text-[#737873] " }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
