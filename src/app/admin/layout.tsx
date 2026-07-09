import Link from "next/link";
import { Database, History, Upload } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: Database },
  { href: "/admin/upload", label: "Upload", icon: Upload },
  { href: "/admin/history", label: "History", icon: History },
];

export const metadata = {
  title: "Admin",
};

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="content-container py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 pb-5">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-nordik-700">
            DATANORTH admin
          </div>
          <h1 className="mt-1 font-display text-display-md font-semibold tracking-tight text-ink-900">
            Data management
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 text-sm font-medium text-ink-700 shadow-elev-1 hover:border-ink-300"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
