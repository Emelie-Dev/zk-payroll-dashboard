export type OnboardingStatus = "not_started" | "in_progress" | "completed";

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
  onboardingStatus: OnboardingStatus;
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

export type UserRole = "admin" | "operator" | "auditor";

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
  status: "pending" | "verified" | "failed" | "cancelled";
  approvalStatus?: "draft" | "pending_executive_approval" | "approved" | "rejected";
  approvalHistory?: Array<{
    approvedBy: string;
    approvedAt: string;
    role: string;
    comment?: string;
  }>;
  txHash?: string;
  isArchived?: boolean;
}

export interface PayrollRun extends PayrollTransaction {
  employeeIds: string[];
  executedAt?: string | null;
  transactionHash?: string | null;
  reconciliationStatus?: "pending" | "partial" | "complete" | "failed";
  reconciliationDetails?: {
    processedCount: number;
    totalCount: number;
    discrepancies?: string[];
    lastReconciliedAt?: string;
  };
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
  revokedBy?: string;
  revocationReason?: string;
}

export interface RevocationHistory {
  id: string;
  viewKeyId: string;
  revokedAt: string;
  revokedBy: string;
  reason: string;
  auditorName: string;
  auditorOrg: string;
}

export interface FundingForecast {
  cycleStart: string;
  cycleEnd: string;
  estimatedTotal: number;
  employeeCount: number;
  breakdown: {
    payrollTotal: number;
    bufferReserve: number;
    miscellaneous: number;
  };
  currentBalance: number;
  fundingGap: number;
  confidence: "high" | "medium" | "low";
  uncertaintyFactors: string[];
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
  isProofNearingExpiration?: boolean;
  treasuryBalanceOverride?: number | null;
}

export type ApprovalEventType =
  | "draft_created"
  | "draft_edited"
  | "proof_generation_started"
  | "proof_generation_completed"
  | "proof_generation_failed"
  | "payroll_confirmed"
  | "submission_started"
  | "submission_completed"
  | "submission_failed";

export interface ApprovalEvent {
  id: string;
  type: ApprovalEventType;
  timestamp: string;
  actor: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface AuditAccessRequest {
  id: string;
  requesterName: string;
  requesterOrg: string;
  requesterEmail: string;
  scope: "read-only" | "full-audit";
  rationale: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  viewKeyId?: string;
}

// ── Multi-asset payroll orchestration ────────────────────────────────────────

export type StellarAsset = {
  code: string;
  issuer?: string; // undefined for native XLM
};

export type AssetGroupStatus =
  | "pending"
  | "funded"
  | "underfunded"
  | "executing"
  | "succeeded"
  | "failed"
  | "partial";

export interface AssetGroupEmployee {
  employeeId: string;
  name: string;
  address: string;
  amount: number;
  /** SHA-256 commitment of the salary — never expose the raw amount to unauthorized viewers */
  salaryCommitment: string;
}

export interface TreasuryReadiness {
  asset: StellarAsset;
  requiredAmount: number;
  availableBalance: number;
  isFunded: boolean;
  shortfall: number;
}

export interface AssetGroup {
  asset: StellarAsset;
  employees: AssetGroupEmployee[];
  totalAmount: number;
  transactionCount: number;
  status: AssetGroupStatus;
  txHash?: string;
  errorMessage?: string;
  executedAt?: string;
  treasuryReadiness: TreasuryReadiness;
}

export type MultiAssetRunStatus =
  | "draft"
  | "ready"
  | "underfunded"
  | "executing"
  | "succeeded"
  | "partial"
  | "failed";

export interface MultiAssetPayrollRun {
  id: string;
  companyId: string;
  label: string;
  createdAt: string;
  executedAt?: string;
  status: MultiAssetRunStatus;
  assetGroups: AssetGroup[];
  totalEmployees: number;
  /** Opaque ZK proof covering all groups */
  proof?: string;
  proofStatus: "none" | "generating" | "ready" | "expired";
}

export type ReconciliationGroupStatus = "complete" | "partial" | "failed" | "pending";

export interface ReconciliationEntry {
  employeeId: string;
  name: string;
  assetCode: string;
  expectedAmount: number;
  confirmedAmount: number;
  status: "confirmed" | "discrepancy" | "missing";
  txHash?: string;
  confirmedAt?: string;
}

export interface MultiAssetReconciliation {
  runId: string;
  generatedAt: string;
  groups: Array<{
    asset: StellarAsset;
    status: ReconciliationGroupStatus;
    entries: ReconciliationEntry[];
    totalExpected: number;
    totalConfirmed: number;
    discrepancyCount: number;
  }>;
  canExportAudit: boolean;
}
