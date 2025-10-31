"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Coordinator {
  name: string;
  contact_number: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  coordinators: Coordinator[];
}

export default function EventSchedule() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      /**
       * Example structure: 
       * events table joined with event_coordinators table 
       * (assuming event_coordinators has event_id, name, contact_number)
       */
      const { data, error } = await supabase
        .from("events")
        .select(`
          id,
          name,
          description,
          start_date,
          end_date,
          event_coordinators (name, contact_number)
        `)
        .order("start_date", { ascending: true });

      if (error) console.error(error);
      else {
        // Normalize coordinators for ease of rendering
        const formatted = data.map((e: any) => ({
          ...e,
          coordinators: e.event_coordinators || [],
        }));
        setEvents(formatted);
      }
      setLoading(false);
    }

    fetchEvents();
  }, [supabase]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading schedule...
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-8">Event Schedule</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 shadow-md">
        <Table>
          <TableCaption>List of all upcoming events and coordinators.</TableCaption>
          <TableHeader className="bg-gray-100 dark:bg-neutral-800">
            <TableRow>
              <TableHead className="w-[30%]">Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Coordinators</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {events.length ? (
              events.map((event, i) => {
                const date = new Date(event.start_date);
                const time = date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow
                    key={event.id}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-900/60 transition-colors"
                  >
                    {/* Event name */}
                    <TableCell className="font-semibold text-neutral-800 dark:text-neutral-100">
                      {event.name}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {date.toLocaleDateString()}
                    </TableCell>

                    {/* Time */}
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {time}
                    </TableCell>

                    {/* Coordinators */}
                    <TableCell>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
                        {event.coordinators.length ? (
                          event.coordinators.map((coord, idx) => (
                            <li key={idx}>{coord.name}</li>
                          ))
                        ) : (
                          <li>—</li>
                        )}
                      </ul>
                    </TableCell>

                    {/* Contact Numbers */}
                    <TableCell>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-none">
                        {event.coordinators.length ? (
                          event.coordinators.map((coord, idx) => (
                            <li key={idx}>{coord.contact_number || "—"}</li>
                          ))
                        ) : (
                          <li>—</li>
                        )}
                      </ul>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No events scheduled yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
