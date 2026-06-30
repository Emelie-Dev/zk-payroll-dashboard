"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import { PayrollRun } from "@/types/models";

interface ReconciliationBadgeProps {
  payrollRun: PayrollRun;
  variant?: "compact" | "detailed";
}

export function ReconciliationBadge({
  payrollRun,
  variant = "compact",
}: ReconciliationBadgeProps) {
  const status = payrollRun.reconciliationStatus || "pending";
  const details = payrollRun.reconciliationDetails;

  const statusConfig = {
    complete: {
      label: "Fully Reconciled",
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
      borderColor: "border-green-200",
    },
    partial: {
      label: "Partially Reconciled",
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-200",
    },
    pending: {
      label: "Awaiting Reconciliation",
      icon: Clock,
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-200",
    },
    failed: {
      label: "Reconciliation Failed",
      icon: XCircle,
      color: "text-red-600 bg-red-50",
      borderColor: "border-red-200",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${config.color} border ${config.borderColor}`}
      >
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${config.borderColor} ${config.color}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold">{config.label}</h3>
          {details && (
            <div className="mt-2 text-sm space-y-1">
              {details.processedCount !== undefined && (
                <p>
                  Processed: {details.processedCount} of {details.totalCount} records
                </p>
              )}
              {details.discrepancies && details.discrepancies.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Discrepancies:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {details.discrepancies.map((disc, idx) => (
                      <li key={idx} className="text-sm">
                        {disc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {details.lastReconciliedAt && (
                <p className="mt-2 text-xs opacity-75">
                  Last reconciled: {new Date(details.lastReconciliedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReconciliationSummary({ payrollRun }: { payrollRun: PayrollRun }) {
  const status = payrollRun.reconciliationStatus || "pending";
  const details = payrollRun.reconciliationDetails;

  if (!details) {
    return null;
  }

  const percentage =
    details.totalCount > 0
      ? Math.round((details.processedCount / details.totalCount) * 100)
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Reconciliation Progress</span>
        <span className="font-medium">
          {details.processedCount}/{details.totalCount}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            status === "complete"
              ? "bg-green-600"
              : status === "partial"
                ? "bg-amber-600"
                : "bg-blue-600"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{percentage}% complete</p>
    </div>
  );
}
