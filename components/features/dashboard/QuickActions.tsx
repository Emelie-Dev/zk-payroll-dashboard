"use client";

import { useRouter } from "next/navigation";
import {
  UserPlus,
  Play,
  Key,
  Upload,
  Plus,
} from "lucide-react";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  adminOnly: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Add Employee",
    description: "Onboard a new team member",
    icon: UserPlus,
    route: "/employees",
    adminOnly: true,
  },
  {
    label: "Execute Payroll",
    description: "Run a batch payment",
    icon: Play,
    route: "/payroll/execute",
    adminOnly: true,
  },
  {
    label: "Create View Key",
    description: "Grant auditor access",
    icon: Key,
    route: "/compliance",
    adminOnly: true,
  },
  {
    label: "Import Employees",
    description: "Bulk import records",
    icon: Upload,
    route: "/employees/import-review",
    adminOnly: true,
  },
];

interface QuickActionsProps {
  role?: "admin" | "operator" | "auditor";
  compact?: boolean;
}

export default function QuickActions({ role = "admin", compact = false }: QuickActionsProps) {
  const router = useRouter();
  const isAdmin = role === "admin";

  const visibleActions = QUICK_ACTIONS.filter(
    (a) => !a.adminOnly || isAdmin
  );

  if (visibleActions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-indigo-500" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Quick Create
        </h3>
      </div>
      <div
        className={`grid gap-2 ${
          compact
            ? "grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => router.push(action.route)}
              className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-left ${
                compact ? "" : ""
              }`}
            >
              <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                  {action.label}
                </p>
                {!compact && (
                  <p className="text-xs text-gray-500 truncate">
                    {action.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
