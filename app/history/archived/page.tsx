import DashboardLayout from "@/components/layout/DashboardLayout";
import TransactionHistory from "@/components/features/transactions/TransactionHistory";

function ArchivedHistoryPage() {
  return (
    <DashboardLayout>
      <TransactionHistory mode="archived" />
    </DashboardLayout>
  );
}

export default ArchivedHistoryPage;
