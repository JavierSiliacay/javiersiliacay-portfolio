export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity from the API
}

interface ApiResponse {
  total: Record<string, number>;
  contributions: (ContributionDay)[];
}

export interface GithubStats {
  total: number;
  currentStreak: number;
  longestStreak: number;
  streakStart: string;
  streakEnd: string;
  live: boolean;
  contributions: ContributionDay[];
}

export async function fetchGithubStats(): Promise<GithubStats> {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/JavierSiliacay",
      { cache: "no-store" }
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

    if (totalContributions === 0) {
      throw new Error("Empty contribution data");
    }

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

    // If today has 0 commits so far, check if yesterday had commits (streak is active)
    if (days[checkIndex] && days[checkIndex].count === 0 && checkIndex > 0) {
      checkIndex = checkIndex - 1;
    }

    let currentStreak = 0;
    const streakEnd = days[checkIndex]?.date || todayStr;
    while (checkIndex >= 0 && days[checkIndex].count > 0) {
      currentStreak++;
      checkIndex--;
    }
    const streakStart = days[checkIndex + 1]?.date || streakEnd;

    // 5. Filter contributions: only up to today (exclude future placeholder days)
    const recentDays = days.filter((d) => d.date <= todayStr);

    return {
      total: totalContributions,
      currentStreak,
      longestStreak,
      streakStart,
      streakEnd,
      live: true,
      contributions: recentDays,
    };
  } catch {
    return {
      total: 1362,
      currentStreak: 30,
      longestStreak: 30,
      streakStart: "2026-09-01",
      streakEnd: "2026-09-30",
      live: false,
      contributions: [],
    };
  }
}
