'use client';

import { DashboardInput } from "./dasboardInput";
import { UserDashboard } from "./userDashboard";
import { DemoDashboard } from "./demoDashboard";
import { useSession } from "next-auth/react";
import { HistoryProvider } from "@/lib/historyContext";

export function Dashboard() {
  const { status } = useSession();

  return (
    <div>
      <div className="min-h-[100vh] w-full flex flex-grow-0 flex-shrink-0 basis-auto items-center flex-col">
        <HistoryProvider>
          <DashboardInput />
          {status === "loading" ? (
            <div className="w-full max-w-6xl mx-auto px-4 py-12 flex justify-center">
              <span className="inline-block w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin-slow" />
            </div>
          ) : status === "authenticated" ? (
            <UserDashboard />
          ) : (
            <DemoDashboard />
          )}
        </HistoryProvider>
      </div>
    </div>
  );
}
