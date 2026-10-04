"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, post } from "@/lib/api";

type Profile = {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_image: string | null;
  created_at: string;
};

type UploadResponse = {
  message?: string;
  profile_image?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const data = await get<Profile>("/users/me", token ?? undefined);

        if (data && typeof data.email === "string") {
          setProfile(data);
        } else {
          setError("Gagal mengambil data profile");
        }
      } catch {
        setError("Terjadi kesalahan saat mengambil data profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadMessage("");
    setUploadError("");

    if (!selectedFile) {
      setUploadError("Pilih file gambar terlebih dahulu");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const data = await post<UploadResponse>(
        "/users/me/profile-image",
        formData,
        token
      );

      if (data.profile_image) {
        setUploadMessage(data.message || "Foto profile berhasil diperbarui");
        setProfile((prev) =>
          prev ? { ...prev, profile_image: data.profile_image ?? null } : prev
        );
      } else {
        setUploadError(data.message || "Gagal upload foto profile");
      }
    } catch {
      setUploadError("Terjadi kesalahan saat upload foto");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>
        {profile?.profile_image ? (
          <img src={profile.profile_image} alt="Profile" width={100} height={100} />
        ) : (
          <p>Tidak ada foto profile</p>
        )}
      </div>
      <p>Name: {profile?.name}</p>
      <p>Email: {profile?.email}</p>
      <p>Role: {profile?.role}</p>
      {profile?.created_at && <p>Created At: {profile.created_at}</p>}

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />
        <button type="submit">Upload Foto</button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}
      {uploadError && <p>{uploadError}</p>}
    </div>
  );
}
