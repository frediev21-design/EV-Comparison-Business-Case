"use client";

import type { TimelineEvent } from "@/engine/decision/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DecisionTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Decision Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {events.map((event, i) => (
            <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
              {i < events.length - 1 && (
                <div className="absolute left-[7px] top-4 h-full w-px bg-border" />
              )}
              <div className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent bg-background" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">{event.label}</p>
                  <p className="text-sm tabular-nums text-accent">{event.date}</p>
                </div>
                {event.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
