export interface Employee {
  id: string;
  address: string;
  name: string;
  email?: string;
  department?: string;
  salary: number;
  salaryCommitment: string;
  isActive: boolean;
  status?: "active" | "inactive" | "pending";
  startDate: string;
  lastPayment?: string;
}

export interface Company {
  id: string;
  name: string;
  admin: string;
  treasury: string;
  employeeCount: number;
  isActive: boolean;
}

export type UserRole = "admin" | "employee";

export interface SessionPayload {
  publicKey: string;
  role: UserRole;
  expiresAt: number;
}

export interface PayrollTransaction {
  id: string;
  companyId: string;
  timestamp: string;
  createdAt: string; // Added for consistency with API filters
  totalAmount: number;
  employeeCount: number;
  proof: string;
  status: "pending" | "verified" | "failed";
  txHash?: string;
}

export interface PayrollRun extends PayrollTransaction {
  employeeIds: string[];
  executedAt?: string | null;
  transactionHash?: string | null;
}

export interface ViewKey {
  id: string;
  keyId: string;
  auditorName: string;
  auditorOrg: string;
  scope: "read-only" | "full-audit";
  grantedBy: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  revokedAt?: string | null;
}

export type PayrollWizardStep = "review" | "proof" | "confirm" | "submit";

export interface PayrollWizardState {
  currentStep: PayrollWizardStep;
  employeeIds: string[];
  totalAmount: number;
  proof: string | null;
  proofStatus: "idle" | "generating" | "success" | "error";
  proofError: string | null;
  submissionStatus: "idle" | "submitting" | "success" | "error";
  submissionError: string | null;
  transactionHash: string | null;
}

// ─── Payroll Lock Reason (#221) ──────────────────────────────────────────────

export type PayrollLockReasonType =
  | "insufficient_treasury"
  | "pending_approval"
  | "zk_proof_failed"
  | "employee_data_changed"
  | "network_error"
  | "manual_freeze"
  | "compliance_hold";

export interface PayrollLock {
  id: string;
  payrollId: string;
  reasonType: PayrollLockReasonType;
  reasonDescription: string;
  lockedAt: string;
  lockedBy: string;
  /** Human-readable instruction on what action can safely unlock or advance this payroll. */
  resolutionAction: string;
  isResolved: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
}

// ─── Recurring Payroll Template (#220) ───────────────────────────────────────

export type PayrollFrequency = "weekly" | "biweekly" | "monthly" | "quarterly";

export interface PayrollTemplate {
  id: string;
  companyId: string;
  name: string;
  description: string;
  frequency: PayrollFrequency;
  employeeIds: string[];
  dayOfMonth?: number; // 1-31, for monthly/quarterly
  dayOfWeek?: number; // 0=Sun..6=Sat, for weekly/biweekly
  isActive: boolean;
  lastExecuted?: string | null;
  nextScheduled?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ─── Overdue Payroll Alert (#219) ────────────────────────────────────────────

export type OverdueAlertSeverity = "warning" | "critical";

export interface OverduePayrollAlert {
  id: string;
  payrollId: string;
  payrollName: string;
  scheduledDate: string;
  dueDate: string;
  severity: OverdueAlertSeverity;
  reason: string;
  totalAmount: number;
  employeeCount: number;
  daysOverdue: number;
}

// ─── Approval Comment History (#222) ─────────────────────────────────────────

export type ApprovalAction = "approved" | "rejected" | "requested_changes" | "commented" | "submitted";

export interface ApprovalComment {
  id: string;
  payrollId: string;
  action: ApprovalAction;
  comment: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  attachmentUrl?: string | null;
}