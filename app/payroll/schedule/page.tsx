import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollHistory from "@/components/features/payroll/PayrollHistory";

function PayrollSchedulePage() {
  return (
    <DashboardLayout>
      <PayrollHistory />
    </DashboardLayout>
  );
}

export default PayrollSchedulePage;
