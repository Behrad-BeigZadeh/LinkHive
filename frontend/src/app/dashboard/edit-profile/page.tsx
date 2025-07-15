"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NeonButton from "@/components/NeonButton";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editProfile } from "@/apis/authApi";
import { AxiosError } from "axios";
import { useUserStore } from "@/stores/userStore";

export default function CreateLinkPage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const data = new FormData();

      if (formData.username) data.append("username", formData.username);
      if (formData.bio) data.append("bio", formData.bio);
      if (formData.password) data.append("password", formData.password);
      if (avatarFile) data.append("image", avatarFile);

      return await editProfile(data);
    },

    onSuccess: (data) => {
      toast.success("Profile Updated!");
      setUser(data);
      router.push("/dashboard");
    },

    onError: (error: AxiosError<{ error: string }>) => {
      const errData = error.response?.data?.error;
      if (Array.isArray(errData)) {
        errData.forEach((err) =>
          toast.error(err.message || "Validation error")
        );
      } else if (typeof errData === "string") {
        toast.error(errData);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  return (
    <div className="w-[80%] sm:w-full max-w-xl mx-auto mt-10 p-6 rounded-lg border bg-zinc-900/40 backdrop-blur-md border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Avatar Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
            className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800"
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="mt-3 w-20 h-20 rounded-full object-cover border border-white/20"
            />
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Bio</label>
          <input
            type="text"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
          />
        </div>

        <NeonButton
          type="submit"
          text={mutation.isPending ? "Saving..." : "Save Changes"}
          color="emerald"
          full
          disabled={mutation.isPending}
          pulse
        />
      </form>
    </div>
  );
}
