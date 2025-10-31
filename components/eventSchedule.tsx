"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabaseClient";
import { Calendar, Clock, User, Phone, Mail, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
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
      <div className="flex flex-col justify-center items-center py-20 sm:py-32">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
        </div>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
          Loading schedule...
        </p>
      </div>
    );

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-neutral-950 dark:via-purple-950/10 dark:to-neutral-950" id="schedule">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-10 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4 sm:mb-6">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">Event Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Event Schedule
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Plan your participation with our comprehensive event timeline
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Coordinators</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-gray-800">
                {events.length ? (
                  events.map((event, i) => {
                    const date = new Date(event.start_date);
                    const time = date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <motion.tr
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-gray-100">{event.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{event.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                              <span>{time}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {event.coordinators.length ? (
                            <div className="space-y-1.5">
                              {event.coordinators.map((coord, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{coord.name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No coordinator assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          {event.coordinators.length ? (
                            <div className="space-y-1.5">
                              {event.coordinators.map((coord, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {coord.contact_number || "—"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No events scheduled yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4 sm:space-y-6">
          <AnimatePresence>
            {events.length ? (
              events.map((event, i) => {
                const date = new Date(event.start_date);
                const time = date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isExpanded = expandedEvent === event.id;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                  >
                    <div
                      onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                      className="p-4 sm:p-6 cursor-pointer"
                    >
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-1">
                              {event.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-2 shrink-0"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            {time}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                              {/* Coordinators */}
                              {event.coordinators.length > 0 ? (
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    Coordinators
                                  </h4>
                                  <div className="space-y-3">
                                    {event.coordinators.map((coord, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800"
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {coord.name}
                                          </span>
                                        </div>
                                        {coord.contact_number && (
                                          <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                              {coord.contact_number}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                                  No coordinator assigned yet
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center"
              >
                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No Events Scheduled</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Check back soon for upcoming events!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Caption */}
        {events.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
          >
            Showing all upcoming events and their coordinators
          </motion.p>
        )}
      </div>
    </section>
  );
}