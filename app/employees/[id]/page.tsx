import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeeDetail from "@/components/features/employees/EmployeeDetail";

function EmployeeDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <EmployeeDetail employeeId={params.id} />
    </DashboardLayout>
  );
}

export default EmployeeDetailPage;
