"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { get } from "@/lib/api";

type Schedule = {
  id: number;
  class_name: string;
  subject: string;
  teacher: string;
  day: string;
  start_time: string;
  end_time: string;
  created_at: string;
};

export default function JadwalPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const data = await get<Schedule[]>("/schedules");

        if (Array.isArray(data)) {
          setSchedules(data);
        } else {
          setError("Gagal mengambil data jadwal");
        }
      } catch {
        setError("Terjadi kesalahan saat mengambil data jadwal");
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (schedules.length === 0) {
    return <p>Belum ada jadwal</p>;
  }

  return (
    <div>
      <h1>Jadwal</h1>
      {schedules.map((s) => (
        <div key={s.id}>
          <h2>{s.subject}</h2>
          <p>Kelas: {s.class_name}</p>
          <p>Guru: {s.teacher}</p>
          <p>Hari: {s.day}</p>
          <p>
            Waktu: {s.start_time} - {s.end_time}
          </p>
          <Link href={`/jadwal/${s.id}`}>Lihat Detail</Link>
        </div>
      ))}
    </div>
  );
}
