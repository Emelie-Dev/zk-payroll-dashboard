import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditAccessRequest } from "@/types/models";

interface AuditRequestState {
  requests: AuditAccessRequest[];
  addRequest: (request: AuditAccessRequest) => void;
  approveRequest: (id: string, viewKeyId: string) => void;
  rejectRequest: (id: string) => void;
  setRequests: (requests: AuditAccessRequest[]) => void;
}

export const useAuditRequestStore = create<AuditRequestState>()(
  persist(
    (set) => ({
      requests: [],
      addRequest: (request) =>
        set((state) => ({ requests: [...state.requests, request] })),
      approveRequest: (id, viewKeyId) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "approved",
                  viewKeyId,
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        })),
      rejectRequest: (id) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "rejected",
                  updatedAt: new Date().toISOString(),
                }
              : r
          ),
        })),
      setRequests: (requests) => set({ requests }),
    }),
    { name: "zk-payroll-audit-requests" },
  ),
);
