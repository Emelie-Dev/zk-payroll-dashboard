import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PayrollExceptionsQueue from '@/components/features/payroll/PayrollExceptionsQueue';

const toastSuccess = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
  },
}));

describe('PayrollExceptionsQueue', () => {
  beforeEach(() => {
    toastSuccess.mockClear();
  });

  it('renders the section heading', () => {
    render(<PayrollExceptionsQueue />);
    expect(
      screen.getByRole('heading', { name: /payroll exceptions queue/i }),
    ).toBeInTheDocument();
  });

  it('renders accessible tabs for transaction and employee exceptions', () => {
    render(<PayrollExceptionsQueue />);
    expect(
      screen.getByRole("tab", { name: /transaction exceptions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /employee exceptions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/sensitive payroll values stay redacted/i)).toBeInTheDocument();
    expect(screen.getAllByRole("table").length).toBe(3);
    expect(screen.getByText(/settlement amount redacted/i)).toBeInTheDocument();
  });

  it('renders exception items from mock data in run exceptions tab', () => {
    render(<PayrollExceptionsQueue />);
    const items = screen.queryAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });

  it('shows reason code for each run exception', () => {
    render(<PayrollExceptionsQueue />);
    expect(screen.getAllByText(/reason:/i).length).toBeGreaterThan(0);
  });

    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByText(/proof generation pending/i)).toBeInTheDocument();
    expect(screen.queryByText(/settlement failed on trust line limit/i)).not.toBeInTheDocument();
  });

  it("filters by search term", async () => {
    const user = userEvent.setup();
    render(<PayrollExceptionsQueue exceptions={TRIAGE_ITEMS} />);

  it('renders link to payroll wizard for each item', () => {
    render(<PayrollExceptionsQueue />);
    const links = screen.getAllByRole('link', { name: /go to payroll wizard/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((l) => expect(l).toHaveAttribute('href', '/payroll'));
  });

  it('renders exception list with accessible label', () => {
    render(<PayrollExceptionsQueue />);
    expect(
      screen.getByRole("tabpanel", { name: /transaction exceptions/i }),
    ).toBeInTheDocument();
  });

  it('allows switching to employee exceptions tab and rendering employee exceptions', () => {
    render(<PayrollExceptionsQueue />);
    const employeeTabButton = screen.getByRole('tab', { name: /employee exceptions/i });
    fireEvent.click(employeeTabButton);

    expect(
      screen.getByRole("tabpanel", { name: /employee exceptions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Amara Diallo")).toBeInTheDocument();
    expect(screen.getByText("Kofi Boateng")).toBeInTheDocument();
    expect(screen.getAllByRole("status", { name: /critical/i })).toHaveLength(3);
    expect(screen.getAllByRole("status", { name: /warning/i })).toHaveLength(1);
  });

  it('resolves employee exceptions when action buttons are clicked', () => {
    render(<PayrollExceptionsQueue />);
    const employeeTabButton = screen.getByRole('tab', { name: /employee exceptions/i });
    fireEvent.click(employeeTabButton);

    const activateButton = screen.getByRole('button', { name: /activate employee/i });
    fireEvent.click(activateButton);

    // Amara Diallo's exception should be removed
    expect(screen.queryByText("Amara Diallo")).not.toBeInTheDocument();
    expect(toastSuccess).toHaveBeenCalledWith("Resolved exception: Employee Activated");
  });
});
