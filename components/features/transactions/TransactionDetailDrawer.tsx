"use client";

import { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  Calendar,
  Users,
  DollarSign,
  Shield,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PayrollTransaction } from "@/types";

interface TransactionDetailDrawerProps {
  transaction: PayrollTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TransactionDetailDrawer({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailDrawerProps) {
  const [showProof, setShowProof] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!transaction) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const maskValue = (value: string, visibleChars = 8) => {
    if (value.length <= visibleChars * 2) return value;
    return `${value.slice(0, visibleChars)}...${value.slice(-visibleChars)}`;
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case "verified":
        return <Badge variant="success">Verified</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  const createdDate = formatDate(transaction.createdAt);
  const processedDate = transaction.timestamp
    ? formatDate(transaction.timestamp)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="space-y-4 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <SheetTitle className="text-2xl">Transaction Details</SheetTitle>
              <SheetDescription>
                View complete information about this payroll transaction
              </SheetDescription>
            </div>
            {getStatusIcon()}
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600 font-mono">
              {transaction.id}
            </span>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6 py-6">
            {/* Transaction Summary */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Transaction Summary
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${transaction.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Employees Paid
                  </span>
                  <span className="font-medium text-gray-900">
                    {transaction.employeeCount}
                  </span>
                </div>
              </div>
            </section>

            {/* Timestamps */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline
              </h4>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Created</div>
                  <div className="text-sm font-medium text-gray-900">
                    {createdDate.date}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {createdDate.time}
                  </div>
                </div>
                {processedDate && (
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">
                      {transaction.status === "verified"
                        ? "Verified"
                        : "Processed"}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {processedDate.date}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {processedDate.time}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Verification Status */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verification
              </h4>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Status
                    </span>
                    {getStatusBadge()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {transaction.status === "verified" &&
                      "This transaction has been cryptographically verified and is immutable on the blockchain."}
                    {transaction.status === "pending" &&
                      "This transaction is awaiting verification. The zero-knowledge proof is being processed."}
                    {transaction.status === "failed" &&
                      "This transaction failed verification. Please contact support if you believe this is an error."}
                  </div>
                </div>

                {/* Zero-Knowledge Proof */}
                {transaction.proof && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        ZK Proof
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowProof(!showProof)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        {showProof ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            Show
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-xs text-gray-900 bg-gray-50 p-2 rounded break-all">
                      {showProof
                        ? transaction.proof
                        : maskValue(transaction.proof, 12)}
                    </div>
                    {showProof && (
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(transaction.proof, "proof")
                        }
                        className="mt-2 text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedField === "proof" ? "Copied!" : "Copy proof"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Blockchain Details */}
            {transaction.txHash && (
              <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Blockchain Details
                </h4>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 mb-2">
                      Transaction Hash
                    </div>
                    <div className="font-mono text-sm text-gray-900 break-all mb-3">
                      {transaction.txHash}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(transaction.txHash!, "txHash")
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedField === "txHash" ? "Copied!" : "Copy"}
                      </button>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${transaction.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View on Explorer
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Company Information */}
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Organization
              </h4>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Company ID</div>
                <div className="font-mono text-sm text-gray-900 break-all">
                  {transaction.companyId}
                </div>
              </div>
            </section>

            {/* Privacy Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-900">
                  <div className="font-medium mb-1">Privacy Protected</div>
                  <div className="text-blue-800">
                    Individual employee salaries and personal information remain
                    encrypted. Only aggregate totals and verification proofs are
                    visible to maintain privacy while ensuring transparency.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default TransactionDetailDrawer;
