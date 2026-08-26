import DashboardLayout from "@/components/layout/DashboardLayout";
import BatchDiffReviewScreen from "@/components/features/batches/BatchDiffReviewScreen";

function PayrollReviewPage() {
  return (
    <DashboardLayout>
      <BatchDiffReviewScreen />
    </DashboardLayout>
  );
}

export default PayrollReviewPage;
