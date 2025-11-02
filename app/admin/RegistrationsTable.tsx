'use client';

import { useState, useEffect } from 'react';

function ClientDate({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    const date = new Date(dateString);
    setFormatted(date.toLocaleString());
  }, [dateString]);
  return <>{formatted || '—'}</>;
}

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

export default function RegistrationsTable({ registrations }: { registrations: RegistrationRow[] }) {
  if (!registrations.length)
    return <p className="text-gray-600 dark:text-gray-400 text-center mt-6">No registrations found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-neutral-800">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Event</th>
            <th className="p-2 border">Participant / Team</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Team Members</th>
            <th className="p-2 border">Payment Status</th>
            <th className="p-2 border">Registered At</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg, i) => {
            const user = reg.users;
            const team = reg.teams;
            const members = reg.team_members?.map((m) => m.name).join(', ') || '—';
            const phoneNo = reg.phone_number || reg.team_members?.[0]?.phone_number || '—';
            const email = reg.team_id ? team?.leader_email || '—' : user?.email || '—';

            return (
              <tr key={reg.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800">
                <td className="p-2 border text-center">{i + 1}</td>
                <td className="p-2 border">{reg.events?.name ?? '—'}</td>
                <td className="p-2 border">
                  {reg.team_id
                    ? `${team?.team_name ?? 'Unnamed Team'} (${team?.team_code ?? ''})`
                    : user?.name ?? 'Solo Participant'}
                </td>
                <td className="p-2 border">{email}</td>
                <td className="p-2 border text-center">{phoneNo}</td>
                <td className="p-2 border text-center">{members}</td>
                <td
                  className={`p-2 border text-center capitalize ${
                    reg.payment_status === 'approved'
                      ? 'text-green-600'
                      : reg.payment_status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
                >
                  {reg.payment_status}
                </td>
                <td className="p-2 border text-center">
                  <ClientDate dateString={reg.registered_at} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
