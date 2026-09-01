import SettingsAssetsPage from "@/components/features/assets/SettingsAssetsPage";

export const metadata = {
  title: "Payroll Assets | ZK Payroll",
  description: "View supported payroll assets and their display metadata.",
};

export default function Page({
  configuredAssets,
}: {
  configuredAssets?: Array<{
    code: string;
    issuer?: string;
    label?: string;
  }> | null;
}) {
  return <SettingsAssetsPage configuredAssets={configuredAssets} />;
}
