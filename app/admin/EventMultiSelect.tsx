'use client';

import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

interface EventMultiSelectProps {
  selectedEvents: string[];
  onSelectionChange: (events: string[]) => void;
}

interface Event {
  id: string;
  name: string;
}

export default function EventMultiSelect({
  selectedEvents,
  onSelectionChange,
}: EventMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (!data.error) {
          setEvents(data);
        } else {
          console.error('Error fetching events:', data.error);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleEvent = (eventName: string) => {
    if (selectedEvents.includes(eventName)) {
      onSelectionChange(selectedEvents.filter((e) => e !== eventName));
    } else {
      onSelectionChange([...selectedEvents, eventName]);
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="relative w-full md:w-80">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        <span className="truncate">
          {loading
            ? 'Loading events...'
            : selectedEvents.length === 0
            ? 'Filter by Events'
            : selectedEvents.length === 1
            ? selectedEvents[0]
            : `${selectedEvents.length} events selected`}
        </span>
        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 flex-shrink-0" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-auto">
            {/* Header with Clear All */}
            {selectedEvents.length > 0 && (
              <div className="sticky top-0 bg-gray-50 dark:bg-neutral-900 px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedEvents.length} selected
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              </div>
            )}

            {/* Event List */}
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No events found
              </div>
            ) : (
              <div className="py-1">
                {events.map((event) => {
                  const isSelected = selectedEvents.includes(event.name);
                  return (
                    <button
                      key={event.id}
                      onClick={() => toggleEvent(event.name)}
                      className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 text-left"
                    >
                      <div
                        className={`w-4 h-4 mr-2 border rounded flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate">{event.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}