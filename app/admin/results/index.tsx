"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient, type User } from "@supabase/supabase-js";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);

// Initialise Supabase JS client (browser)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RealignmentRecord {
  id: string;
  name: string;
  org_type: string;
  redundancy?: number;
  ai_readiness?: number;
  estimated_savings?: number;
  created_at: string | Date;
  user_email?: string;
  consultant_comment?: string;
}

export default function AdminResultsListPage() {
  // UI state
  const [records, setRecords] = useState<RealignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "created_at" | "redundancy" | "savings"
  >("created_at");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "complete" | "incomplete"
  >("all");
  const [visibleCount, setVisibleCount] = useState(10);
  const [user, setUser] = useState<User | null>(null);

  /* --------------------------------- Effects -------------------------------- */

  // Grab logged‑in user (client‑side)
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u }, error }) => {
      if (error) console.error("Auth error:", error.message);
      else setUser(u);
    });
  }, []);

  // Fetch all realignment submissions
  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from("realignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setRecords(data as RealignmentRecord[]);
      setLoading(false);
    };

    fetchRecords();
  }, []);

  /* ------------------------------- Permissions ------------------------------ */

  if (!user?.email?.endsWith("@northpathstrategies.org")) {
    return (
      <div className="p-6 text-red-600">
        Access denied: Consultants only.
      </div>
    );
  }

  /* ----------------------------- Derived helpers ---------------------------- */

  const filtered = records
    .filter((r) => r.name?.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => {
      if (statusFilter === "complete")
        return r.redundancy && r.ai_readiness && r.estimated_savings;
      if (statusFilter === "incomplete")
        return !(
          r.redundancy &&
          r.ai_readiness &&
          r.estimated_savings
        );
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "redundancy")
        return (b.redundancy || 0) - (a.redundancy || 0);
      if (sortBy === "savings")
        return (b.estimated_savings || 0) - (a.estimated_savings || 0);
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    })
    .slice(0, visibleCount);

  const summaryChartData = {
    labels: ["Avg Redundancy", "Avg AI Readiness", "Total Savings"],
    datasets: [
      {
        label: "Metrics",
        backgroundColor: ["#F87171", "#60A5FA", "#FACC15"],
        data: [
          filtered.length
            ? Math.round(
                filtered.reduce(
                  (sum, r) => sum + (r.redundancy || 0),
                  0
                ) / filtered.length
              )
            : 0,
          filtered.length
            ? Math.round(
                filtered.reduce(
                  (sum, r) => sum + (r.ai_readiness || 0),
                  0
                ) / filtered.length
              )
            : 0,
          filtered.reduce(
            (sum, r) => sum + (r.estimated_savings || 0),
            0
          ),
        ],
      },
    ],
  };

  /* --------------------------------- Render -------------------------------- */

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        All Realignment Submissions
      </h1>

      {/* Filters / controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end gap-3">
        <input
          type="text"
          placeholder="Search by institution..."
          className="input w-full sm:w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input w-full sm:w-52"
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as "created_at" | "redundancy" | "savings"
            )
          }
        >
          <option value="created_at">Newest</option>
          <option value="redundancy">Redundancy Score</option>
          <option value="savings">Estimated Savings</option>
        </select>
        <select
          className="input w-full sm:w-52"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as "all" | "complete" | "incomplete"
            )
          }
        >
          <option value="all">All Statuses</option>
          <option value="complete">Complete</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <button
          className="btn-secondary"
          onClick={() => {
            const header = [
              "Name",
              "Org Type",
              "Redundancy",
              "AI Readiness",
              "Estimated Savings",
              "Created At",
              "Email",
              "Consultant Comment",
            ];
            const rows = filtered.map((r) => [
              r.name,
              r.org_type,
              r.redundancy ?? "",
              r.ai_readiness ?? "",
              r.estimated_savings ?? "",
              typeof r.created_at === "string"
                ? r.created_at
                : r.created_at.toISOString(),
              r.user_email || "",
              r.consultant_comment || "",
            ]);
            const csv = [header, ...rows]
              .map((row) => row.join(","))
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "realignment_summary.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Dashboard summary */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-2">
              Dashboard Summary
            </h2>
            <p className="text-sm">
              Total Submissions: {filtered.length}
            </p>
            <p className="text-sm">
              Total Estimated Savings: $
              {filtered
                .reduce(
                  (sum, r) => sum + (r.estimated_savings || 0),
                  0
                )
                .toLocaleString()}
            </p>
            <p className="text-sm">
              Average AI Readiness:{" "}
              {filtered.length
                ? Math.round(
                    filtered.reduce(
                      (sum, r) => sum + (r.ai_readiness || 0),
                      0
                    ) / filtered.length
                  )
                : 0}
              %
            </p>
          </div>

          {/* Chart */}
          <Bar
            className="mt-4"
            data={summaryChartData}
            options={{
              indexAxis: "y",
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  ticks: {
                    callback: (value) => Number(value).toLocaleString(),
                  },
                },
              },
            }}
          />

          {/* Record list */}
          <ul className="space-y-4 mt-8">
            {filtered.map((record) => {
              const statusComplete =
                record.redundancy &&
                record.ai_readiness &&
                record.estimated_savings;
              return (
                <li
                  key={record.id}
                  className={`border-2 p-4 rounded shadow-sm bg-white dark:bg-gray-800 ${
                    record.estimated_savings &&
                    record.estimated_savings >= 250000
                      ? "border-green-500"
                      : !statusComplete
                      ? "border-yellow-400"
                      : "border-gray-200"
                  } ${record.ai_readiness && record.ai_readiness >= 75
                    ? "font-semibold"
                    : ""}`}
                >
                  <p className="font-medium">{record.name}</p>
                  <p className="text-sm text-gray-600">
                    Org Type: {record.org_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted:{" "}
                    {typeof record.created_at === "string"
                      ? new Date(record.created_at).toLocaleDateString()
                      : new Date(record.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Email: {record.user_email}
                  </p>
                  <Link
                    href={`/admin/results/${record.id}`}
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    View Consultant Report
                  </Link>
                </li>
              );
            })}
          </ul>

          {visibleCount < records.length && (
            <div className="mt-6 text-center">
              <button
                className="btn-secondary"
                onClick={() => setVisibleCount((c) => c + 10)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
