"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { get } from "@/lib/api";

type Announcement = {
  id: number;
  title: string;
  content: string;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const data = await get<Announcement[]>("/announcements");

        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else {
          setError("Gagal mengambil data pengumuman");
        }
      } catch {
        setError("Terjadi kesalahan saat mengambil data pengumuman");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (announcements.length === 0) {
    return <p>Belum ada pengumuman</p>;
  }

  return (
    <div>
      <h1>Pengumuman</h1>
      {announcements.map((a) => (
        <div key={a.id}>
          {a.cover_url ? (
            <img src={a.cover_url} alt={a.title} width={200} height={120} />
          ) : (
            <p>Tidak ada cover</p>
          )}
          <h2>{a.title}</h2>
          <p>{a.content}</p>
          <p>Dibuat: {a.created_at}</p>
          <Link href={`/pengumuman/${a.id}`}>Lihat Detail</Link>
        </div>
      ))}
    </div>
  );
}
