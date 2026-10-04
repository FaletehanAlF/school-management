"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { get } from "@/lib/api";

type Announcement = {
  id: number;
  title: string;
  content: string;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

export default function DetailPengumumanPage() {
  const params = useParams();
  const id = params.id;
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await get<Announcement>(`/announcements/${id}`);

        if (data && typeof data.title === "string") {
          setAnnouncement(data);
        } else {
          setError("Pengumuman tidak ditemukan");
        }
      } catch {
        setError("Terjadi kesalahan saat mengambil detail pengumuman");
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
      {announcement?.cover_url ? (
        <img
          src={announcement.cover_url}
          alt={announcement.title}
          width={400}
          height={240}
        />
      ) : (
        <p>Tidak ada cover</p>
      )}
      <h1>{announcement?.title}</h1>
      <p>{announcement?.content}</p>
      <p>Dibuat: {announcement?.created_at}</p>
      <p>Diperbarui: {announcement?.updated_at}</p>
    </div>
  );
}
