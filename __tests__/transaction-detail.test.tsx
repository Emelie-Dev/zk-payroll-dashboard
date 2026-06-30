import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionDetailDrawer from "@/components/features/transactions/TransactionDetailDrawer";
import type { PayrollTransaction } from "@/types";

const mockTransaction: PayrollTransaction = {
  id: "tx_001",
  companyId: "company_001",
  timestamp: "2025-02-28T09:01:00Z",
  createdAt: "2025-02-28T09:01:00Z",
  totalAmount: 9500,
  employeeCount: 2,
  proof: "0xzkproof_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  status: "verified",
  txHash: "abc123def456ghi789jkl012",
};

describe("TransactionDetailDrawer", () => {
  it("renders transaction details when open", () => {
    const onOpenChange = vi.fn();

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByText("Transaction Details")).toBeInTheDocument();
    expect(screen.getByText("tx_001")).toBeInTheDocument();
    expect(screen.getByText("$9,500")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays verified status correctly", () => {
    const onOpenChange = vi.fn();

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getAllByText("Verified").length).toBeGreaterThan(0);
  });

  it("displays pending status correctly", () => {
    const onOpenChange = vi.fn();
    const pendingTx = { ...mockTransaction, status: "pending" as const };

    render(
      <TransactionDetailDrawer
        transaction={pendingTx}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
  });

  it("masks ZK proof by default", () => {
    const onOpenChange = vi.fn();

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    // Should show masked version
    expect(screen.queryByText(mockTransaction.proof)).not.toBeInTheDocument();
  });

  it("reveals ZK proof when show button is clicked", async () => {
    const onOpenChange = vi.fn();

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    const showButton = screen.getByRole("button", { name: /show/i });
    fireEvent.click(showButton);

    await waitFor(() => {
      expect(screen.getByText(mockTransaction.proof)).toBeInTheDocument();
    });
  });

  it("displays transaction hash and explorer link", () => {
    const onOpenChange = vi.fn();

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByText(mockTransaction.txHash!)).toBeInTheDocument();
    expect(screen.getByText("View on Explorer")).toBeInTheDocument();
  });

  it("copies transaction hash to clipboard", async () => {
    const onOpenChange = vi.fn();
    const mockWriteText = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    const copyButton = screen.getAllByRole("button", { name: /copy/i })[0];
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(mockTransaction.txHash);
    });
  });

  it("shows privacy notice", () => {
    const onOpenChange = vi.fn();

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByText("Privacy Protected")).toBeInTheDocument();
    expect(
      screen.getByText(/Individual employee salaries and personal information remain encrypted/i)
    ).toBeInTheDocument();
  });

  it("does not render when transaction is null", () => {
    const onOpenChange = vi.fn();

    const { container } = render(
      <TransactionDetailDrawer
        transaction={null}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("does not show blockchain section when txHash is not present", () => {
    const onOpenChange = vi.fn();
    const txWithoutHash = { ...mockTransaction, txHash: undefined };

    render(
      <TransactionDetailDrawer
        transaction={txWithoutHash}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.queryByText("Blockchain Details")).not.toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    const onOpenChange = vi.fn();

    render(
      <TransactionDetailDrawer
        transaction={mockTransaction}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getAllByText("February 28, 2025").length).toBeGreaterThan(0);
  });
});
