import { Employee, Company, CompanyConfig, PayrollTransaction, PayrollRun, ViewKey, FundingForecast, AuditAccessRequest, MultiAssetPayrollRun } from "@/types/models";

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp_001",
    address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
    name: "Alice Mensah",
    email: "alice@zkpayroll.io",
    department: "Engineering",
    salary: 5000,
    salaryCommitment: "0xabc123def456",
    isActive: true,
    status: "active",
    onboardingStatus: "completed",
    startDate: "2024-01-15T00:00:00Z",
    lastPayment: "2025-02-28T09:01:00Z",
  },
  {
    id: "emp_002",
    address: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
    name: "Kwame Asante",
    email: "kwame@zkpayroll.io",
    department: "Product",
    salary: 4500,
    salaryCommitment: "0xdef789ghi012",
    isActive: true,
    status: "active",
    onboardingStatus: "completed",
    startDate: "2024-02-01T00:00:00Z",
    lastPayment: "2025-02-28T09:01:05Z",
  },
  {
    id: "emp_003",
    address: "GBVXCPHJMZ5HZJMBBP3YMBM6HXKH3JRXJBHXJHXJHXJHXJHXJHXJHX",
    name: "Amara Diallo",
    email: "amara@zkpayroll.io",
    department: "Finance",
    salary: 4800,
    salaryCommitment: "0xghi345jkl678",
    isActive: false,
    status: "inactive",
    onboardingStatus: "completed",
    startDate: "2023-08-01T00:00:00Z",
    lastPayment: "2024-11-30T09:00:00Z",
  },
  {
    id: "emp_004",
    address: "GCZJM2ZPKZM5LZPM2CZJM2ZPKZM5LZPM2CZJM2ZPKZM5LZPM2CZJM2",
    name: "Kofi Boateng",
    email: "kofi@zkpayroll.io",
    department: "Engineering",
    salary: 5200,
    salaryCommitment: "0xmno901pqr234",
    isActive: true,
    status: "pending",
    onboardingStatus: "in_progress",
    startDate: "2025-03-01T00:00:00Z",
  },
  {
    id: "emp_005",
    address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W38",
    name: "Yaa Asantewaa",
    email: "yaa@zkpayroll.io",
    department: "Operations",
    salary: 4200,
    salaryCommitment: "0xstu456vwx789",
    isActive: true,
    status: "pending",
    onboardingStatus: "not_started",
    startDate: "2025-04-01T00:00:00Z",
  },
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: "company_001",
    name: "ZK Payroll Inc.",
    admin: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
    treasury: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
    employeeCount: 2,
    isActive: true,
  },
];

export const MOCK_COMPANY_CONFIG: CompanyConfig = {
  id: "company_001",
  name: "ZK Payroll Inc.",
  admin: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
  treasury: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
  employeeCount: 2,
  isActive: true,
  network: "TESTNET",
  contracts: {
    registry: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    commitment: "CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    verifier: "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    executor: "CDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
    audit: "CEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
  },
  auditSettings: {
    enabled: true,
    retentionDays: 365,
    requireAuditorApproval: false,
  },
};


export const MOCK_TRANSACTIONS: PayrollTransaction[] = [
  {
    id: "tx_001",
    companyId: "company_001",
    timestamp: "2025-02-28T09:01:00Z",
    createdAt: "2025-02-28T09:01:00Z",
    totalAmount: 9500,
    employeeCount: 2,
    proof: "0xzkproof_abc123", // ZK proof string
    status: "verified",
    txHash: "abc123def456",
    isArchived: false,
  },
  {
    id: "tx_002",
    companyId: "company_001",
    timestamp: "2025-01-31T09:00:00Z",
    createdAt: "2025-01-31T09:00:00Z",
    totalAmount: 9500,
    employeeCount: 2,
    proof: "0xzkproof_def789",
    status: "verified",
    txHash: "def789ghi012",
    isArchived: true,
  },
  {
    id: "tx_003",
    companyId: "company_001",
    timestamp: "2025-03-31T09:00:00Z",
    createdAt: "2025-03-31T09:00:00Z",
    totalAmount: 9500,
    employeeCount: 2,
    proof: "",
    status: "pending",
    isArchived: false,
  },
  {
    id: "tx_004",
    companyId: "company_001",
    timestamp: "2025-04-30T09:00:00Z",
    createdAt: "2025-04-30T09:00:00Z",
    totalAmount: 4800,
    employeeCount: 1,
    proof: "",
    status: "cancelled",
    isArchived: false,
  },
];

export const MOCK_PAYROLL_RUNS: PayrollRun[] = MOCK_TRANSACTIONS.map(tx => ({
  ...tx,
  employeeIds: ["emp_001", "emp_002"],
  executedAt: tx.status === "verified" ? tx.timestamp : null,
  transactionHash: tx.txHash || null,
}));

export const MOCK_PAYROLL_RUNS_EMPTY: PayrollRun[] = [];

export const MOCK_PAYROLL_RUNS_FIRST_RUN: PayrollRun[] = [
  {
    id: "tx_first",
    companyId: "company_001",
    timestamp: "2026-07-15T09:00:00Z",
    createdAt: "2026-06-01T09:00:00Z",
    totalAmount: 9500,
    employeeCount: 2,
    proof: "",
    status: "pending",
    employeeIds: ["emp_001", "emp_002"],
    executedAt: null,
    transactionHash: null,
  },
];

export const MOCK_TREASURY_BALANCE = {
  balance: 45000,
  projectedPayroll: 19500,
  lastFunded: "2025-02-15T10:00:00Z",
};

export const MOCK_FUNDING_FORECAST: FundingForecast = {
  cycleStart: "2025-03-25T00:00:00Z",
  cycleEnd: "2025-04-25T00:00:00Z",
  estimatedTotal: 19500,
  employeeCount: 3,
  breakdown: {
    payrollTotal: 14700,
    bufferReserve: 3800,
    miscellaneous: 1000,
  },
  currentBalance: 45000,
  fundingGap: 25500,
  confidence: "medium",
  uncertaintyFactors: [
    "New employee (Kofi Boateng) pending approval – adds $5,200/month",
    "Buffer reserve may fluctuate with variable compensation adjustments",
  ],
};

export const MOCK_VIEW_KEYS: ViewKey[] = [
  {
    id: "vk_001",
    keyId: "vk_audit_abc123",
    auditorName: "Sarah Chen",
    auditorOrg: "Deloitte",
    scope: "full-audit",
    grantedBy: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
    createdAt: "2025-01-15T10:00:00Z",
    expiresAt: "2026-01-15T10:00:00Z",
    isActive: true,
  },
  {
    id: "vk_002",
    keyId: "vk_audit_def456",
    auditorName: "James Okafor",
    auditorOrg: "KPMG",
    scope: "read-only",
    grantedBy: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
    createdAt: "2025-06-01T08:00:00Z",
    expiresAt: "2025-12-01T08:00:00Z",
    isActive: false,
    revokedAt: "2025-11-15T14:30:00Z",
  },
];

export const MOCK_AUDIT_REQUESTS: AuditAccessRequest[] = [
  {
    id: "req_001",
    requesterName: "Michael Chang",
    requesterOrg: "PwC",
    requesterEmail: "m.chang@pwc.com",
    scope: "full-audit",
    rationale: "Annual compliance audit for Q1-Q2 2025.",
    status: "pending",
    createdAt: "2025-06-25T09:00:00Z",
  },
  {
    id: "req_002",
    requesterName: "Elena Rodriguez",
    requesterOrg: "EY",
    requesterEmail: "elena.r@ey.com",
    scope: "read-only",
    rationale: "Preliminary review of transaction volumes.",
    status: "approved",
    createdAt: "2025-06-20T14:30:00Z",
    updatedAt: "2025-06-21T10:00:00Z",
    viewKeyId: "vk_001",
  },
  {
    id: "req_003",
    requesterName: "David Kim",
    requesterOrg: "Independent",
    requesterEmail: "david@dkim-audit.net",
    scope: "full-audit",
    rationale: "Investigating specific anomaly report.",
    status: "rejected",
    createdAt: "2025-05-10T11:15:00Z",
    updatedAt: "2025-05-11T09:45:00Z",
  },
];

export const MOCK_MULTI_ASSET_RUNS: MultiAssetPayrollRun[] = [
  {
    id: "mar_001",
    companyId: "company_001",
    label: "Q3 2026 Multi-Asset Payroll — Engineering & Product",
    createdAt: "2026-07-01T08:00:00Z",
    executedAt: "2026-07-02T10:15:00Z",
    status: "succeeded",
    totalEmployees: 3,
    proof: "0xzkproof_multiasset_001",
    proofStatus: "ready",
    assetGroups: [
      {
        asset: { code: "USDC", issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" },
        employees: [
          { employeeId: "emp_001", name: "Alice Mensah", address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37", amount: 3500, salaryCommitment: "0xabc123def456" },
          { employeeId: "emp_002", name: "Kwame Asante", address: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN", amount: 3200, salaryCommitment: "0xdef789ghi012" },
        ],
        totalAmount: 6700,
        transactionCount: 2,
        status: "succeeded",
        txHash: "abc123usdc_tx_001",
        executedAt: "2026-07-02T10:15:00Z",
        treasuryReadiness: { asset: { code: "USDC", issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" }, requiredAmount: 6700, availableBalance: 12000, isFunded: true, shortfall: 0 },
      },
      {
        asset: { code: "XLM" },
        employees: [
          { employeeId: "emp_004", name: "Kofi Boateng", address: "GCZJM2ZPKZM5LZPM2CZJM2ZPKZM5LZPM2CZJM2ZPKZM5LZPM2CZJM2", amount: 15000, salaryCommitment: "0xmno901pqr234" },
        ],
        totalAmount: 15000,
        transactionCount: 1,
        status: "succeeded",
        txHash: "xlm_tx_001",
        executedAt: "2026-07-02T10:16:00Z",
        treasuryReadiness: { asset: { code: "XLM" }, requiredAmount: 15000, availableBalance: 45000, isFunded: true, shortfall: 0 },
      },
    ],
  },
  {
    id: "mar_002",
    companyId: "company_001",
    label: "Q3 2026 Contractor Payroll — Mixed Assets",
    createdAt: "2026-07-10T09:00:00Z",
    status: "partial",
    totalEmployees: 3,
    proofStatus: "ready",
    proof: "0xzkproof_multiasset_002",
    assetGroups: [
      {
        asset: { code: "EURC", issuer: "GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP" },
        employees: [
          { employeeId: "emp_001", name: "Alice Mensah", address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37", amount: 2800, salaryCommitment: "0xabc123def456" },
        ],
        totalAmount: 2800,
        transactionCount: 1,
        status: "succeeded",
        txHash: "eurc_tx_002",
        executedAt: "2026-07-10T11:00:00Z",
        treasuryReadiness: { asset: { code: "EURC", issuer: "GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP" }, requiredAmount: 2800, availableBalance: 5000, isFunded: true, shortfall: 0 },
      },
      {
        asset: { code: "USDC", issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" },
        employees: [
          { employeeId: "emp_002", name: "Kwame Asante", address: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN", amount: 4500, salaryCommitment: "0xdef789ghi012" },
          { employeeId: "emp_005", name: "Yaa Asantewaa", address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W38", amount: 3800, salaryCommitment: "0xstu456vwx789" },
        ],
        totalAmount: 8300,
        transactionCount: 2,
        status: "failed",
        errorMessage: "Transaction rejected: insufficient trust line limit on receiving account",
        treasuryReadiness: { asset: { code: "USDC", issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" }, requiredAmount: 8300, availableBalance: 12000, isFunded: true, shortfall: 0 },
      },
    ],
  },
  {
    id: "mar_003",
    companyId: "company_001",
    label: "August 2026 Payroll — Underfunded Draft",
    createdAt: "2026-07-25T08:00:00Z",
    status: "underfunded",
    totalEmployees: 4,
    proofStatus: "none",
    assetGroups: [
      {
        asset: { code: "USDC", issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" },
        employees: [
          { employeeId: "emp_001", name: "Alice Mensah", address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37", amount: 3500, salaryCommitment: "0xabc123def456" },
          { employeeId: "emp_002", name: "Kwame Asante", address: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN", amount: 3200, salaryCommitment: "0xdef789ghi012" },
        ],
        totalAmount: 6700,
        transactionCount: 2,
        status: "funded",
        treasuryReadiness: { asset: { code: "USDC", issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" }, requiredAmount: 6700, availableBalance: 12000, isFunded: true, shortfall: 0 },
      },
      {
        asset: { code: "EURC", issuer: "GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP" },
        employees: [
          { employeeId: "emp_004", name: "Kofi Boateng", address: "GCZJM2ZPKZM5LZPM2CZJM2ZPKZM5LZPM2CZJM2ZPKZM5LZPM2CZJM2", amount: 4200, salaryCommitment: "0xmno901pqr234" },
          { employeeId: "emp_005", name: "Yaa Asantewaa", address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W38", amount: 3800, salaryCommitment: "0xstu456vwx789" },
        ],
        totalAmount: 8000,
        transactionCount: 2,
        status: "underfunded",
        treasuryReadiness: { asset: { code: "EURC", issuer: "GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP" }, requiredAmount: 8000, availableBalance: 3500, isFunded: false, shortfall: 4500 },
      },
    ],
  },
];
