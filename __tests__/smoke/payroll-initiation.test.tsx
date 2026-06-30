import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import PayrollSummary from "@/components/features/payroll/PayrollSummary";

vi.mock("@/lib/zk", () => ({
  generatePayrollProof: vi.fn().mockResolvedValue({
    proof: { publicSignals: [], proof: { commitment: "abc123def456" } },
    publicInputs: { merkleRoot: "", totalPayrollAmount: "", payrollPeriodId: "" },
    sorobanArgs: [],
    verification: { isValid: true, verifiedAt: new Date().toISOString() },
  }),
}));

describe("Smoke: Payroll Initiation Flow", () => {
  it("renders payroll summary with key metrics", () => {
    render(<PayrollSummary />);
    expect(screen.getByText("Total Payroll")).toBeInTheDocument();
    expect(screen.getByText("$124,500")).toBeInTheDocument();
    expect(screen.getByText("Active Employees")).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("Pending Approvals")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("has proof generation button", () => {
    render(<PayrollSummary />);
    expect(
      screen.getByRole("button", { name: /generate mock payroll proof/i }),
    ).toBeInTheDocument();
  });

  it("transitions to generating state on click", async () => {
    render(<PayrollSummary />);
    const button = screen.getByRole("button", {
      name: /generate mock payroll proof/i,
    });
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    await waitFor(() => {
      expect(button).toBeDisabled();
    });
    expect(screen.getByText("Generating...")).toBeInTheDocument();
  });

  it("shows success message after proof generation", async () => {
    render(<PayrollSummary />);
    const button = screen.getByRole("button", {
      name: /generate mock payroll proof/i,
    });
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/verified/i)).toBeInTheDocument();
    });
  });
});
