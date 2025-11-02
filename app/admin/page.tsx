'use client';

import { useEffect, useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import RegistrationSearchBar from './registerationSearchBar';
import RegistrationsTable from '@/app/admin/RegistrationsTable';
import EventMultiSelect from '@/app/admin/EventMultiSelect';
import { saveAs } from 'file-saver';

interface RegistrationRow {
  id: string;
  payment_status: string;
  registered_at: string;
  user_id: string | null;
  team_id: string | null;
  phone_number?: string;
  users?: { name: string; email: string };
  teams?: { team_name: string; team_code: string; leader_email?: string };
  team_members?: { name: string; email: string; phone_number?: string }[];
  events?: { name: string };
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/api/registrations');
      const json = await res.json();
      if (!json.error) setRegistrations(json);
      else console.error(json.error);
    };
    loadData();
  }, []);

  // Apply search + status + event filters
  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let result = registrations;

    // Filter by payment status
    if (filterStatus !== 'all') {
      result = result.filter((r) => r.payment_status === filterStatus);
    }

    // Filter by selected events
    if (selectedEvents.length > 0) {
      result = result.filter((r) => 
        r.events?.name && selectedEvents.includes(r.events.name)
      );
    }

    // If no search query, return filtered by status and events only
    if (!query) return result;

    // Apply search filter
    const numericQuery = query.replace(/\D/g, ''); // for phone search
    
    result = result.filter((reg) => {
      const user = reg.users;
      const team = reg.teams;
      const members = reg.team_members || [];
      const event = reg.events;

      // Check text fields
      const textMatch =
        user?.name?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query) ||
        team?.team_name?.toLowerCase().includes(query) ||
        team?.team_code?.toLowerCase().includes(query) ||
        event?.name?.toLowerCase().includes(query) ||
        team?.leader_email?.toLowerCase().includes(query) ||
        members.some(
          (m) =>
            m.name?.toLowerCase().includes(query) ||
            m.email?.toLowerCase().includes(query)
        );

      // Check phone numbers (only if query contains digits)
      const phoneMatch = numericQuery.length > 0 && (
        (reg.phone_number &&
          reg.phone_number.replace(/\D/g, '').includes(numericQuery)) ||
        members.some(
          (m) =>
            m.phone_number &&
            m.phone_number.replace(/\D/g, '').includes(numericQuery)
        )
      );

      // Return true if EITHER text or phone matches
      return textMatch || phoneMatch;
    });

    return result;
  }, [searchQuery, filterStatus, selectedEvents, registrations]);

  const downloadCSV = () => {
    const headers = ['#', 'Event', 'Participant/Team', 'Email', 'Phone', 'Team Members', 'Payment Status', 'Registered At'];
    const rows = filtered.map((reg, i) => {
      const user = reg.users;
      const team = reg.teams;
      const members = reg.team_members?.map((m) => `${m.name} (${m.email})`).join('; ') || '';
      const participant = reg.team_id
        ? `${team?.team_name ?? 'Unnamed Team'} (${team?.team_code ?? ''})`
        : user?.name ?? 'Solo Participant';
      const email = reg.team_id ? (team?.leader_email || '—') : (user?.email || '—');
      const phone = reg.phone_number || (reg.team_members && reg.team_members[0]?.phone_number) || '—';

      return [
        i + 1,
        reg.events?.name ?? '—',
        participant,
        email,
        phone,
        members || '—',
        reg.payment_status,
        new Date(reg.registered_at).toLocaleString(),
      ];
    });

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'registrations.csv');
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard – All Registrations</h1>
        
        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Event Multi-Select */}
          <EventMultiSelect
            selectedEvents={selectedEvents}
            onSelectionChange={setSelectedEvents}
          />

          {/* Status Filters + Download */}
          <div className="flex flex-wrap gap-3">
            {['all', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-lg border capitalize ${
                  filterStatus === status
                    ? status === 'approved'
                      ? 'bg-green-600 text-white'
                      : status === 'pending'
                      ? 'bg-yellow-500 text-white'
                      : status === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-neutral-800'
                }`}
              >
                {status}
              </button>
            ))}
            <button
              onClick={downloadCSV}
              className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-5 h-5" /> Download
            </button>
          </div>
        </div>
      </div>

      <RegistrationSearchBar onSearch={setSearchQuery} placeholder="Search by name, email, team, or phone..." />

      <RegistrationsTable registrations={filtered} />
    </main>
  );
}