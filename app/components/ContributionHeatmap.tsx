"use client";

import { useMemo } from "react";
import type { ContributionDay } from "@/app/lib/github";

interface ContributionHeatmapProps {
  contributions: ContributionDay[];
  weeks?: number;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const HEATMAP_COLORS = [
  "var(--heatmap-0)",
  "var(--heatmap-1)",
  "var(--heatmap-2)",
  "var(--heatmap-3)",
  "var(--heatmap-4)",
];

export default function ContributionHeatmap({
  contributions,
  weeks = 20,
}: ContributionHeatmapProps) {
  const { grid, monthLabels, totalInRange } = useMemo(() => {
    if (!contributions.length) {
      return { grid: [], monthLabels: [], totalInRange: 0 };
    }

    // Get the most recent date in the data
    const lastDate = new Date(contributions[contributions.length - 1].date);

    // Find the end of the current week (Saturday)
    const endOfWeek = new Date(lastDate);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

    // Go back `weeks` weeks from end of week
    const startDate = new Date(endOfWeek);
    startDate.setDate(startDate.getDate() - weeks * 7 + 1);

    // Build a lookup map for quick access
    const lookup = new Map<string, ContributionDay>();
    contributions.forEach((d) => lookup.set(d.date, d));

    // Build the grid: array of weeks, each with 7 days (Sun-Sat)
    const weekColumns: (ContributionDay & { empty?: boolean })[][] = [];
    const months: { label: string; colStart: number }[] = [];
    let lastMonth = -1;
    let rangeTotal = 0;

    const cursor = new Date(startDate);
    let weekIndex = 0;
    let currentWeek: (ContributionDay & { empty?: boolean })[] = [];

    // Pad the first week if it doesn't start on Sunday
    const startDay = cursor.getDay();
    if (startDay > 0) {
      for (let i = 0; i < startDay; i++) {
        currentWeek.push({ date: "", count: 0, level: 0, empty: true });
      }
    }

    while (cursor <= endOfWeek) {
      const dateStr = cursor.toISOString().split("T")[0];
      const dayData = lookup.get(dateStr);
      const day: ContributionDay & { empty?: boolean } = dayData
        ? { ...dayData }
        : { date: dateStr, count: 0, level: 0 };

      // Track month labels
      const month = cursor.getMonth();
      if (month !== lastMonth) {
        months.push({ label: MONTH_LABELS[month], colStart: weekIndex });
        lastMonth = month;
      }

      rangeTotal += day.count;
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weekColumns.push(currentWeek);
        currentWeek = [];
        weekIndex++;
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    // Push any remaining partial week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", count: 0, level: 0, empty: true });
      }
      weekColumns.push(currentWeek);
    }

    return { grid: weekColumns, monthLabels: months, totalInRange: rangeTotal };
  }, [contributions, weeks]);

  if (!grid.length) {
    return (
      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 text-center py-4">
        No contribution data available
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Month labels */}
      <div className="flex pl-[18px]">
        {monthLabels.map((m, i) => {
          const nextStart =
            i < monthLabels.length - 1
              ? monthLabels[i + 1].colStart
              : grid.length;
          const span = nextStart - m.colStart;
          return (
            <span
              key={`${m.label}-${m.colStart}`}
              className="text-[9px] font-mono text-slate-400 dark:text-slate-500"
              style={{
                width: `${span * 13}px`,
                minWidth: `${span * 13}px`,
              }}
            >
              {span >= 2 ? m.label : ""}
            </span>
          );
        })}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-[1.5px] items-start overflow-x-auto">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[1.5px] mr-0.5 shrink-0">
          {["", "M", "", "W", "", "F", ""].map((label, i) => (
            <div
              key={i}
              className="h-[11px] w-[12px] flex items-center justify-center text-[8px] font-mono text-slate-400 dark:text-slate-500"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {grid.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[1.5px]">
            {week.map((day, dIdx) => {
              if (day.empty) {
                return (
                  <div key={`${wIdx}-${dIdx}`} className="w-[11px] h-[11px]" />
                );
              }

              const level = Math.min(4, Math.max(0, day.level || 0));

              return (
                <div
                  key={day.date || `${wIdx}-${dIdx}`}
                  className="w-[11px] h-[11px] rounded-[2px] transition-colors duration-200"
                  title={
                    day.date
                      ? `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`
                      : ""
                  }
                  style={{ backgroundColor: HEATMAP_COLORS[level] }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
          {totalInRange.toLocaleString()} contributions in the last {weeks} weeks
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500">
            Less
          </span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-[9px] h-[9px] rounded-[2px]"
              style={{ backgroundColor: HEATMAP_COLORS[level] }}
            />
          ))}
          <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500">
            More
          </span>
        </div>
      </div>
    </div>
  );
}
