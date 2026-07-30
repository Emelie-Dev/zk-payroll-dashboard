import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PayrollExceptionsQueue, {
  type PayrollExceptionItem,
} from "@/components/features/payroll/PayrollExceptionsQueue";

const TRIAGE_ITEMS: PayrollExceptionItem[] = [
  {
    id: "exc_blocking",
    runId: "run_blocking",
    title: "Settlement failed on trust line limit",
    summary: "A reconciliation error blocked the run.",
    source: "reconciliation",
    severity: "blocking",
    status: "in_review",
    nextAction: "Increase the receiving trust line limit and retry settlement.",
    redactedValueLabel: "Settlement amount redacted",
    createdAt: "2026-07-10T11:00:00Z",
  },
  {
    id: "exc_warning",
    runId: "run_warning",
    title: "Proof generation pending",
    summary: "The payroll batch is waiting on proof generation.",
    source: "payroll-engine",
    severity: "warning",
    status: "open",
    nextAction: "Generate the ZK proof and resubmit the run.",
    redactedValueLabel: "Payroll amount redacted",
    createdAt: "2026-07-12T11:00:00Z",
  },
  {
    id: "exc_info",
    runId: "run_info",
    title: "Payroll run cancelled after review",
    summary: "The run was intentionally cancelled.",
    source: "compliance",
    severity: "info",
    status: "resolved",
    nextAction: "No action required.",
    redactedValueLabel: "Sensitive run details hidden",
    createdAt: "2026-07-13T11:00:00Z",
  },
];

describe("PayrollExceptionsQueue", () => {
  it("renders grouped severity sections with redaction copy", () => {
    render(<PayrollExceptionsQueue exceptions={TRIAGE_ITEMS} />);

    expect(
      screen.getByRole("region", { name: /payroll exception triage/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/sensitive payroll values stay redacted/i)).toBeInTheDocument();
    expect(screen.getAllByRole("table").length).toBe(3);
    expect(screen.getByText(/settlement amount redacted/i)).toBeInTheDocument();
  });

  it("filters by severity", async () => {
    const user = userEvent.setup();
    render(<PayrollExceptionsQueue exceptions={TRIAGE_ITEMS} />);

    await user.selectOptions(screen.getByLabelText(/filter by severity/i), "warning");

    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByText(/proof generation pending/i)).toBeInTheDocument();
    expect(screen.queryByText(/settlement failed on trust line limit/i)).not.toBeInTheDocument();
  });

  it("filters by source and status", async () => {
    const user = userEvent.setup();
    render(<PayrollExceptionsQueue exceptions={TRIAGE_ITEMS} />);

    await user.selectOptions(screen.getByLabelText(/filter by source/i), "compliance");
    await user.selectOptions(screen.getByLabelText(/filter by status/i), "resolved");

    const table = screen.getAllByRole("table")[0];
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(within(table).getByText(/sensitive run details hidden/i)).toBeInTheDocument();
    expect(within(table).getByText(/no action required/i)).toBeInTheDocument();
    expect(screen.queryByText(/generate the zk proof/i)).not.toBeInTheDocument();
  });

  it("renders an empty state when there are no exceptions", () => {
    render(<PayrollExceptionsQueue exceptions={[]} />);

    expect(screen.getByText(/no payroll exceptions to triage/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open payroll/i })).toHaveAttribute(
      "href",
      "/payroll",
    );
  });
});
