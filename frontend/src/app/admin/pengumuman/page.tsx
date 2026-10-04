"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, post, put, del } from "@/lib/api";

type User = {
  role: string;
};

type Announcement = {
  id: number;
  title: string;
  content: string;
  cover_url: string | null;
  created_at: string;
};

type CreateResponse = {
  message?: string;
};

export default function AdminPengumumanPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  const fetchAnnouncements = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const data = await get<Announcement[]>(
        "/announcements",
        token ?? undefined
      );

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
    fetchAnnouncements();
  }, [router, fetchAnnouncements]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormMessage("");
    setFormError("");

    if (!title || !content) {
      setFormError("Title dan content wajib diisi");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      const data = await post<CreateResponse>("/announcements", formData, token);

      if (data.message === "Pengumuman berhasil dibuat") {
        setFormMessage("Pengumuman berhasil dibuat");
        setTitle("");
        setContent("");
        setImage(null);
        setShowForm(false);
        fetchAnnouncements();
      } else {
        setFormError(data.message || "Gagal membuat pengumuman");
      }
    } catch {
      setFormError("Terjadi kesalahan saat membuat pengumuman");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus pengumuman ini?"
    );

    if (!confirmed) {
      return;
    }

    setFormMessage("");
    setFormError("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const data = await del<CreateResponse>(`/announcements/${id}`, token);

      if (data.message === "Pengumuman berhasil dihapus") {
        setFormMessage("Pengumuman berhasil dihapus");
        fetchAnnouncements();
      } else {
        setFormError(data.message || "Gagal menghapus pengumuman");
      }
    } catch {
      setFormError("Terjadi kesalahan saat menghapus pengumuman");
    }
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setCoverUrl("");
    setImage(null);
    setFormMessage("");
    setFormError("");
  }

  function handleEdit(a: Announcement) {
    setEditingId(a.id);
    setTitle(a.title);
    setContent(a.content);
    setCoverUrl(a.cover_url ?? "");
    setImage(null);
    setFormMessage("");
    setFormError("");
    setShowForm(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setFormMessage("");
    setFormError("");

    if (!title || !content) {
      setFormError("Title dan content wajib diisi");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const data = await put<CreateResponse>(
        `/announcements/${editingId}`,
        { title, content, cover_url: coverUrl || null },
        token
      );

      if (data.message === "Pengumuman berhasil diperbarui") {
        setFormMessage("Pengumuman berhasil diperbarui");
        setShowForm(false);
        setEditingId(null);
        setTitle("");
        setContent("");
        setCoverUrl("");
        fetchAnnouncements();
      } else {
        setFormError(data.message || "Gagal memperbarui pengumuman");
      }
    } catch {
      setFormError("Terjadi kesalahan saat memperbarui pengumuman");
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
      <h1>Kelola Pengumuman</h1>
      <button
        onClick={() => {
          setEditingId(null);
          setTitle("");
          setContent("");
          setCoverUrl("");
          setImage(null);
          setShowForm(true);
        }}
      >
        Tambah Pengumuman
      </button>

      {formMessage && <p>{formMessage}</p>}

      {showForm && (
        <form onSubmit={editingId !== null ? handleUpdate : handleCreate}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          {editingId !== null ? (
            <div>
              <label>Cover URL</label>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>
          )}
          <button type="submit">
            {editingId !== null ? "Simpan Perubahan" : "Simpan Pengumuman"}
          </button>
          <button type="button" onClick={handleCancel}>
            Batal
          </button>
          {formError && <p>{formError}</p>}
        </form>
      )}

      {announcements.length === 0 ? (
        <p>Belum ada pengumuman</p>
      ) : (
        announcements.map((a) => (
          <div key={a.id}>
            <h2>{a.title}</h2>
            <p>{a.content}</p>
            {a.cover_url && (
              <img src={a.cover_url} alt={a.title} width={150} height={90} />
            )}
            <p>Dibuat: {a.created_at}</p>
            <button onClick={() => handleEdit(a)}>Edit</button>
            <button onClick={() => handleDelete(a.id)}>Hapus</button>
          </div>
        ))
      )}
    </div>
  );
}
