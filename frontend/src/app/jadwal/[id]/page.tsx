"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function DetailJadwalPage() {
  const params = useParams();
  const id = params.id;
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await get<Schedule>(`/schedules/${id}`);

        if (data && typeof data.subject === "string") {
          setSchedule(data);
        } else {
          setError("Jadwal tidak ditemukan");
        }
      } catch {
        setError("Terjadi kesalahan saat mengambil detail jadwal");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>{schedule?.subject}</h1>
      <p>Kelas: {schedule?.class_name}</p>
      <p>Guru: {schedule?.teacher}</p>
      <p>Hari: {schedule?.day}</p>
      <p>
        Waktu: {schedule?.start_time} - {schedule?.end_time}
      </p>
      <p>Dibuat: {schedule?.created_at}</p>
    </div>
  );
}
