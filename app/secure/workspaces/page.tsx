/* app/(secure)/workspaces/page.tsx */
'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';          // browser-side client
import { useParams, useRouter } from 'next/navigation';
import type { Route } from 'next';
import { saveSurveyData, saveRoleData } from '@/lib/storage';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Role } from '@/types/types';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

/* ---------- local helpers ---------- */

type Version = {
  id: string;
  name: string;
  org_type: string;
  roles: Role[];
  accessed_by: string;
  accessed_at: string;
  note?: string;
};

function groupByDate(entries: Version[]) {
  return entries.reduce<Record<string, Version[]>>((acc, item) => {
    const dateKey = new Date(item.accessed_at).toLocaleDateString();
    (acc[dateKey] ??= []).push(item);
    return acc;
  }, {});
}

function chartData(entries: Version[]) {
  const dateCounts = entries.reduce<Record<string, number>>((acc, v) => {
    const date = new Date(v.accessed_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(dateCounts).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  return {
    labels,
    datasets: [
      {
        label: 'Versions Restored',
        data: labels.map((l) => dateCounts[l]),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        fill: true,
      },
    ],
  };
}

/* ---------- page component ---------- */

export default function HistoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [versions, setVersions] = useState<Version[]>([]);
  const [openDiffId, setOpenDiffId] = useState<string | null>(null);

  // filter state
  const [filterText, setFilterText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /* --- handlers -------------------------------------------------------- */

  const handleRestore = async (v: Version) => {

    const { data, error } = await supabase
      .from('realignments')
      .insert([
        {
          user_email: v.accessed_by,
          name: `${v.name} (Restored)`,
          org_type: v.org_type,
          roles: JSON.stringify(v.roles) as any,
          favorited: false,
          tag: 'restored',
          access_level: 'owner',
          shared_with: [],
        },
      ])
      .select()
      .single();

    if (error || !data) {
      window.alert('Failed to restore version.');
      return;
    }

    // Removed note update block as note is not a column

    saveSurveyData({ name: data.name, orgType: data.org_type });
    saveRoleData((data.roles as unknown as Role[]) ?? []);
    router.push('/results' as Route);
  };

  const renderDiff = (a?: unknown, b?: unknown) => {
    const keys = Array.from(
      new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]),
    );

    return (
      <div className="text-xs bg-gray-100 border rounded p-2 whitespace-pre-wrap space-y-1">
        {keys.map((key) => {
          const aVal = JSON.stringify((a as any)?.[key] ?? '∅');
          const bVal = JSON.stringify((b as any)?.[key] ?? '∅');
          const changed = aVal !== bVal;

          return (
            <div key={key}>
              <strong className={changed ? 'text-red-600' : 'text-gray-500'}>
                {key}:
              </strong>{' '}
              <span className={changed ? 'text-red-600' : 'text-gray-700'}>
                {aVal} → {bVal}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  /* --- data fetch ------------------------------------------------------ */

  useEffect(() => {
    if (!id) return;

    const fetchHistory = async () => {
      const { data, error } = await (supabase as any)
        .from('realignment_versions')
        .select('*')
        .eq('realignment_id', id)
        .order('accessed_at', { ascending: false });

      if (!error && data) setVersions(data as Version[]);
    };

    fetchHistory();
  }, [id]);

  /* --- derived values -------------------------------------------------- */

  const filteredVersions = useMemo(() => {
    return versions.filter((v) => {
      const matchesText =
        v.name.toLowerCase().includes(filterText.toLowerCase()) ||
        v.note?.toLowerCase().includes(filterText.toLowerCase());

      const accessedAtIso = new Date(v.accessed_at)
        .toISOString()
        .split('T')[0];

      const afterStart = !startDate || accessedAtIso >= startDate;
      const beforeEnd = !endDate || accessedAtIso <= endDate;

      return matchesText && afterStart && beforeEnd;
    });
  }, [versions, filterText, startDate, endDate]);

  const grouped = useMemo(() => groupByDate(filteredVersions), [filteredVersions]);

  /* --- render ---------------------------------------------------------- */

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Version History</h1>

      {/* quick export */}
      <button
        className="mb-4 text-sm text-green-700 underline"
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob([JSON.stringify(versions, null, 2)], {
              type: 'application/json',
            }),
          );
          const a = document.createElement('a');
          a.href = url;
          a.download = 'realignment_versions.json';
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Export Version History (JSON)
      </button>

      {/* filters --------------------------------------------------------- */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Filter &amp; Analyze
      </h2>

      <input
        type="text"
        placeholder="Filter by name or note…"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="mb-4 w-full border rounded p-2 text-sm"
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2 text-sm flex-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2 text-sm flex-1"
        />
      </div>

      {filteredVersions.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            <strong>Compare to Previous:</strong> highlights field-level changes
            between consecutive versions.
          </p>

          <div className="mb-6 max-w-full overflow-x-auto">
            <Line data={chartData(filteredVersions)} options={{ responsive: true }} />
          </div>
        </>
      )}

      {filteredVersions.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-lg">No history found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters or check another workspace.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, group]) => (
          <section
            key={date}
            className="mb-8 border rounded-lg bg-gray-50 p-4 shadow-sm"
          >
            <h3 className="text-md font-semibold text-gray-700 mb-2">{date}</h3>

            <ul className="space-y-4">
              {group.map((v, idx) => {
                const prev = idx < group.length - 1 ? group[idx + 1] : null;

                return (
                  <li key={v.id} className="border p-4 rounded shadow-sm bg-white">
                    <h4 className="text-lg font-semibold">{v.name}</h4>
                    <p className="text-sm text-gray-600">Org&nbsp;Type: {v.org_type}</p>

                    {v.note && (
                      <p className="text-sm italic text-gray-500 mb-2">Note: {v.note}</p>
                    )}

                    <p className="text-xs text-gray-400">
                      Viewed by {v.accessed_by}&nbsp;at&nbsp;
                      {new Date(v.accessed_at).toLocaleTimeString()}
                    </p>

                    <button
                      className="mt-2 text-sm text-blue-600 underline"
                      onClick={() => handleRestore(v)}
                    >
                      Restore
                    </button>

                    {prev && (
                      <>
                        <button
                          className="mt-2 ml-4 text-sm text-indigo-600 underline"
                          onClick={() =>
                            setOpenDiffId((curr) => (curr === v.id ? null : v.id))
                          }
                        >
                          {openDiffId === v.id ? 'Hide Diff' : 'Compare to Previous'}
                        </button>

                        {openDiffId === v.id && renderDiff(prev.roles, v.roles)}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}