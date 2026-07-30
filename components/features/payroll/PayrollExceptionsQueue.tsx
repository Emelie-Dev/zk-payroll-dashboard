"use client";

import { useMemo, useState, type ElementType } from "react";
import {
  AlertTriangle,
  Info,
  Search,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  MOCK_MULTI_ASSET_RUNS,
  MOCK_TRANSACTIONS,
} from "@/lib/api/mockData";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";

export type ExceptionSeverity = "blocking" | "warning" | "info";
export type ExceptionSource = "payroll-engine" | "reconciliation" | "compliance";
export type ExceptionStatus = "open" | "in_review" | "resolved";

export interface PayrollExceptionItem {
  id: string;
  runId: string;
  title: string;
  summary: string;
  source: ExceptionSource;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  nextAction: string;
  redactedValueLabel: string;
  createdAt: string;
}

interface PayrollExceptionsQueueProps {
  exceptions?: PayrollExceptionItem[];
}

const SEVERITY_ORDER: ExceptionSeverity[] = ["blocking", "warning", "info"];

const SEVERITY_META: Record<
  ExceptionSeverity,
  { label: string; description: string; icon: ElementType; className: string }
> = {
  blocking: {
    label: "Blocking",
    description: "Issues that stop payroll from continuing safely.",
    icon: AlertTriangle,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  warning: {
    label: "Warning",
    description: "Issues that need review before the next payroll step.",
    icon: ShieldAlert,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  info: {
    label: "Info",
    description: "Informational notices that do not require immediate action.",
    icon: Info,
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
};

const SOURCE_LABELS: Record<ExceptionSource, string> = {
  "payroll-engine": "Payroll engine",
  reconciliation: "Reconciliation",
  compliance: "Compliance",
};

const STATUS_OPTIONS: Array<ExceptionStatus | "all"> = [
  "all",
  "open",
  "in_review",
  "resolved",
];

function buildDefaultExceptions(): PayrollExceptionItem[] {
  const pendingRun = MOCK_TRANSACTIONS.find((tx) => tx.status === "pending");
  const cancelledRun = MOCK_TRANSACTIONS.find((tx) => tx.status === "cancelled");
  const failedMultiAssetRun = MOCK_MULTI_ASSET_RUNS.find((run) => run.status === "failed");

  return [
    pendingRun
      ? {
          id: pendingRun.id,
          runId: pendingRun.id,
          title: "Proof generation pending",
          summary: "The payroll batch is waiting on proof generation before submission.",
          source: "payroll-engine",
          severity: "warning",
          status: "open",
          nextAction: "Generate the ZK proof and resubmit the run.",
          redactedValueLabel: "Payroll amount redacted",
          createdAt: pendingRun.createdAt,
        }
      : null,
    failedMultiAssetRun
      ? {
          id: failedMultiAssetRun.id,
          runId: failedMultiAssetRun.id,
          title: "Trust line limit blocked settlement",
          summary:
            failedMultiAssetRun.assetGroups[1]?.errorMessage ??
            "A reconciliation error blocked the multi-asset payroll run.",
          source: "reconciliation",
          severity: "blocking",
          status: "in_review",
          nextAction: "Increase the receiving trust line limit and retry settlement.",
          redactedValueLabel: "Settlement amount redacted",
          createdAt: failedMultiAssetRun.createdAt,
        }
      : null,
    cancelledRun
      ? {
          id: cancelledRun.id,
          runId: cancelledRun.id,
          title: "Payroll run cancelled after review",
          summary: "The run was intentionally cancelled and requires no follow-up.",
          source: "compliance",
          severity: "info",
          status: "resolved",
          nextAction: "No action required.",
          redactedValueLabel: "Sensitive run details hidden",
          createdAt: cancelledRun.createdAt,
        }
      : null,
  ].filter(Boolean) as PayrollExceptionItem[];
}

function severityIcon(severity: ExceptionSeverity) {
  const Icon = SEVERITY_META[severity].icon;
  return <Icon className="h-4 w-4" aria-hidden />;
}

function filterLabel(value: string) {
  return value.replace(/[-_]/g, " ");
}

export default function PayrollExceptionsQueue({
  exceptions = buildDefaultExceptions(),
}: PayrollExceptionsQueueProps) {
  const [severityFilter, setSeverityFilter] = useState<ExceptionSeverity | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ExceptionSource | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ExceptionStatus | "all">("all");

  const filtered = useMemo(
    () =>
      exceptions.filter((item) => {
        if (severityFilter !== "all" && item.severity !== severityFilter) {
          return false;
        }
        if (sourceFilter !== "all" && item.source !== sourceFilter) {
          return false;
        }
        if (statusFilter !== "all" && item.status !== statusFilter) {
          return false;
        }
        return true;
      }),
    [exceptions, severityFilter, sourceFilter, statusFilter],
  );

  const grouped = useMemo(
    () =>
      SEVERITY_ORDER.map((severity) => ({
        severity,
        items: filtered.filter((item) => item.severity === severity),
      })).filter((group) => group.items.length > 0),
    [filtered],
  );

  const counts = useMemo(
    () =>
      SEVERITY_ORDER.reduce(
        (acc, severity) => {
          acc[severity] = exceptions.filter((item) => item.severity === severity).length;
          return acc;
        },
        { blocking: 0, warning: 0, info: 0 } as Record<ExceptionSeverity, number>,
      ),
    [exceptions],
  );

  const hasFilters =
    severityFilter !== "all" || sourceFilter !== "all" || statusFilter !== "all";

  if (exceptions.length === 0) {
    return (
      <section aria-labelledby="exceptions-heading" className="rounded-lg bg-white p-6 shadow-sm">
        <h2 id="exceptions-heading" className="text-base font-semibold text-gray-900">
          Payroll exception triage
        </h2>
        <EmptyState
          title="No payroll exceptions to triage"
          description="Admins will see blocking errors, warnings, and informational notices here once payroll runs surface issues."
          action={{ label: "Open payroll", href: "/payroll" }}
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="exceptions-heading" className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="exceptions-heading" className="text-base font-semibold text-gray-900">
            Payroll exception triage
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Group payroll failures by severity, source, and next action while keeping
            sensitive values redacted.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {SEVERITY_ORDER.map((severity) => {
            const meta = SEVERITY_META[severity];
            return (
              <div key={severity} className={`rounded-lg border px-3 py-2 ${meta.className}`}>
                <div className="flex items-center gap-1 font-semibold">
                  {severityIcon(severity)}
                  <span>{meta.label}</span>
                </div>
                <p className="mt-1 text-[11px] opacity-80">{counts[severity]} total</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" aria-hidden />
          Filters
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
              Severity
            </span>
            <select
              aria-label="Filter by severity"
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(event.target.value as ExceptionSeverity | "all")
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All severities</option>
              <option value="blocking">Blocking</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
              Source
            </span>
            <select
              aria-label="Filter by source"
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(event.target.value as ExceptionSource | "all")
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All sources</option>
              <option value="payroll-engine">Payroll engine</option>
              <option value="reconciliation">Reconciliation</option>
              <option value="compliance">Compliance</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
              Status
            </span>
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ExceptionStatus | "all")
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All statuses" : filterLabel(status)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 h-4 w-4 text-gray-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">
                No exceptions match the current filters
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Clear one or more filters to see additional triage items.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => {
            const meta = SEVERITY_META[group.severity];
            return (
              <section key={group.severity} className="rounded-lg border border-gray-200">
                <div className={`flex items-start justify-between gap-3 border-b px-4 py-3 ${meta.className}`}>
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      {severityIcon(group.severity)}
                      {meta.label}
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium">
                        {group.items.length}
                      </span>
                    </h3>
                    <p className="mt-1 text-xs opacity-80">{meta.description}</p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                    {group.severity} queue
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200" aria-label={`${meta.label} exceptions`}>
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Required next action
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Redaction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {group.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 align-top">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900">{SOURCE_LABELS[item.source]}</p>
                              <p className="mt-1 text-xs text-gray-500">{item.title}</p>
                              <p className="mt-1 text-[11px] text-gray-400">Run {item.runId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-col gap-2">
                              <StatusBadge status={item.status} />
                              <span className="inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                                {item.status === "in_review" ? "In review" : item.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <p className="text-sm text-gray-700">{item.nextAction}</p>
                            <p className="mt-1 text-xs text-gray-500">{item.summary}</p>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <p className="text-sm text-gray-700">{item.redactedValueLabel}</p>
                            <p className="mt-1 text-xs text-gray-400">
                              Updated {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <p>
          Sensitive payroll values stay redacted in this view.
        </p>
        <Link href="/payroll" className="font-medium text-indigo-600 hover:underline">
          Back to payroll
        </Link>
      </div>
    </section>
  );
}
