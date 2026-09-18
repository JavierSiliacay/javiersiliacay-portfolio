import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ContributionDay {
  date: string;
  count: number;
}

interface ApiResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

export async function GET() {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/JavierSiliacay",
      {
        cache: "no-store",
        headers: {
          "User-Agent": "JavierSiliacay-Portfolio",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch from GitHub API: ${res.status}`);
    }

    const data: ApiResponse = await res.json();

    // 1. Calculate total lifetime contributions
    const totalContributions = Object.values(data.total || {}).reduce(
      (sum, val) => sum + (typeof val === "number" ? val : 0),
      0
    );

    // 2. Sort contributions chronologically (ascending by date: YYYY-MM-DD)
    const days = [...(data.contributions || [])].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // 3. Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < days.length; i++) {
      if (days[i].count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    // 4. Calculate current streak (looking backwards from today/yesterday)
    const todayStr = new Date().toISOString().split("T")[0];
    let checkIndex = days.findIndex((d) => d.date === todayStr);

    if (checkIndex === -1) {
      checkIndex = days.length - 1;
    }

    // If today has 0 commits so far, check if yesterday had commits (streak is still active)
    if (days[checkIndex] && days[checkIndex].count === 0 && checkIndex > 0) {
      checkIndex = checkIndex - 1;
    }

    let currentStreak = 0;
    while (checkIndex >= 0 && days[checkIndex].count > 0) {
      currentStreak++;
      checkIndex--;
    }

    if (totalContributions === 0) {
      throw new Error("Empty contribution data");
    }

    return NextResponse.json(
      {
        total: totalContributions,
        currentStreak,
        longestStreak,
        live: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    // Graceful fallback if network or rate limit restricts
    return NextResponse.json({
      total: 1239,
      currentStreak: 18,
      longestStreak: 18,
      live: false,
    });
  }
}

