"use client";

import { X, Mail, MapPin, Briefcase, Calendar, DollarSign, Wallet } from "lucide-react";
import type { Employee } from "@/types";
import OnboardingBadge from "./OnboardingBadge";

interface EmployeeDetailProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDetail({ employee, isOpen, onClose }: EmployeeDetailProps) {
  if (!isOpen || !employee) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Slide-over */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[70] overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Employee Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-indigo-600">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{employee.name}</h3>
            <p className="text-gray-500">{employee.department || "General"}</p>
            
            <div className="mt-4">
               <OnboardingBadge status={employee.onboardingStatus} />
            </div>
          </div>

          <div className="space-y-8">
            {/* Professional Info */}
            <section>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Professional Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">{employee.department || "Not Assigned"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(employee.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Monthly Salary</p>
                    <p className="text-sm font-medium text-gray-900">${employee.salary.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Info */}
            <section>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Information</h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </div>
                  <p className="text-sm font-medium text-gray-900">{employee.email || "No email provided"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Wallet className="w-3.5 h-3.5" /> Stellar Address
                  </div>
                  <p className="text-xs font-mono break-all bg-gray-100 p-2 rounded text-gray-600">
                    {employee.address}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Salary Commitment
                  </div>
                  <p className="text-xs font-mono break-all text-gray-500">
                    {employee.salaryCommitment}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6">
          <button 
            className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
