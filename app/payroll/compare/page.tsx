import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollComparison from "@/components/features/payroll/PayrollComparison";

function PayrollComparePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payroll Run Comparison
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Compare metrics and identify changes across payroll periods
          </p>
        </div>
        <PayrollComparison runs={[]} />
      </div>
    </DashboardLayout>
  );
}

export default PayrollComparePage;
