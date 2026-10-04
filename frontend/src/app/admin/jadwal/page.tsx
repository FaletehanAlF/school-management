"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, post, put, del } from "@/lib/api";

type User = {
  role: string;
};

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

type ApiResponse = {
  message?: string;
};

export default function AdminJadwalPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formError, setFormError] = useState("");

  const fetchSchedules = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const data = await get<Schedule[]>("/schedules", token ?? undefined);

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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login");
      return;
    }

    let user: User;
    try {
      user = JSON.parse(userRaw);
    } catch {
      router.push("/login");
      return;
    }

    if (user.role !== "teacher") {
      setAllowed(false);
      setLoading(false);
      return;
    }

    setAllowed(true);
    fetchSchedules();
  }, [router, fetchSchedules]);

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setClassName("");
    setSubject("");
    setTeacher("");
    setDay("");
    setStartTime("");
    setEndTime("");
    setFormError("");
  }

  function handleEdit(s: Schedule) {
    setEditingId(s.id);
    setClassName(s.class_name);
    setSubject(s.subject);
    setTeacher(s.teacher);
    setDay(s.day);
    setStartTime(s.start_time);
    setEndTime(s.end_time);
    setFormError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");
    setFormError("");

    if (!className || !subject || !teacher || !day || !startTime || !endTime) {
      setFormError("Semua field wajib diisi");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const body = {
      class_name: className,
      subject,
      teacher,
      day,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      if (editingId !== null) {
        const data = await put<ApiResponse>(
          `/schedules/${editingId}`,
          body,
          token
        );

        if (data.message === "Jadwal berhasil diperbarui") {
          setSuccessMessage("Jadwal berhasil diperbarui");
          resetForm();
          fetchSchedules();
        } else {
          setFormError(data.message || "Gagal memperbarui jadwal");
        }
      } else {
        const data = await post<ApiResponse>("/schedules", body, token);

        if (data.message === "Jadwal berhasil dibuat") {
          setSuccessMessage("Jadwal berhasil dibuat");
          resetForm();
          fetchSchedules();
        } else {
          setFormError(data.message || "Gagal membuat jadwal");
        }
      }
    } catch {
      setFormError("Terjadi kesalahan saat menyimpan jadwal");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus jadwal ini?"
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");
    setFormError("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const data = await del<ApiResponse>(`/schedules/${id}`, token);

      if (data.message === "Jadwal berhasil dihapus") {
        setSuccessMessage("Jadwal berhasil dihapus");
        fetchSchedules();
      } else {
        setError(data.message || "Gagal menghapus jadwal");
      }
    } catch {
      setError("Terjadi kesalahan saat menghapus jadwal");
    }
  }

  if (!allowed && !loading) {
    return <p>Akses hanya untuk teacher</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Kelola Jadwal</h1>
      <button
        onClick={() => {
          setEditingId(null);
          setClassName("");
          setSubject("");
          setTeacher("");
          setDay("");
          setStartTime("");
          setEndTime("");
          setShowForm(true);
        }}
      >
        Tambah Jadwal
      </button>

      {successMessage && <p>{successMessage}</p>}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <div>
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label>Teacher</label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </div>
          <div>
            <label>Day</label>
            <input
              type="text"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
          <div>
            <label>Start Time</label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label>End Time</label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <button type="submit">
            {editingId !== null ? "Simpan Perubahan" : "Simpan Jadwal"}
          </button>
          <button type="button" onClick={resetForm}>
            Batal
          </button>
          {formError && <p>{formError}</p>}
        </form>
      )}

      {schedules.length === 0 ? (
        <p>Belum ada jadwal</p>
      ) : (
        schedules.map((s) => (
          <div key={s.id}>
            <p>Kelas: {s.class_name}</p>
            <p>Mata Pelajaran: {s.subject}</p>
            <p>Guru: {s.teacher}</p>
            <p>Hari: {s.day}</p>
            <p>
              Waktu: {s.start_time} - {s.end_time}
            </p>
            <button onClick={() => handleEdit(s)}>Edit</button>
            <button onClick={() => handleDelete(s.id)}>Hapus</button>
          </div>
        ))
      )}
    </div>
  );
}
