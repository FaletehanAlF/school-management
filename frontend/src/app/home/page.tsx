"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/lib/api";

type DashboardSummary = {
  total_users: number;
  total_students: number;
  total_teachers: number;
  total_announcements: number;
  total_schedules: number;
};

export default function HomePage() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchSummary() {
      try {
        const data = await get<DashboardSummary>("/dashboard/summary", token ?? undefined);

        if (typeof data.total_users === "number") {
          setSummary(data);
        } else {
          setError("Gagal mengambil data dashboard");
        }
      } catch {
        setError("Terjadi kesalahan saat mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h2>Total Users</h2>
          <p>{summary?.total_users}</p>
        </div>
        <div>
          <h2>Total Students</h2>
          <p>{summary?.total_students}</p>
        </div>
        <div>
          <h2>Total Teachers</h2>
          <p>{summary?.total_teachers}</p>
        </div>
        <div>
          <h2>Total Announcements</h2>
          <p>{summary?.total_announcements}</p>
        </div>
        <div>
          <h2>Total Schedules</h2>
          <p>{summary?.total_schedules}</p>
        </div>
      </div>
    </div>
  );
}
