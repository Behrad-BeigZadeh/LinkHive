"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NeonButton from "@/components/NeonButton";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editLink } from "@/apis/linksApi";
import { AxiosError } from "axios";
import { Link, useLinkSTore } from "@/stores/linkStore";

export default function EditLink() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { linksLength, allLinks } = useLinkSTore();
  const currentLink = allLinks.find((link: Link) => link.id === id);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (currentLink) {
      setFormData({
        title: currentLink.title,
        url: currentLink.url,
        isActive: currentLink.isActive,
        order: currentLink.order,
      });
    }
  }, [currentLink]);

  const mutation = useMutation({
    mutationFn: () => editLink(id, formData),
    onSuccess: () => {
      toast.success("Link Updated!");
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      if (error.response?.data?.error) {
        const errors = error.response.data.error;
        if (Array.isArray(errors)) {
          errors.forEach((err) =>
            toast.error(err.message || "Validation error")
          );
        } else if (typeof errors === "string") {
          toast.error(errors);
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Failed to edit link");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!id) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-cyan-400 border-white/10" />
      </div>
    );
  }

  return (
    <div className="w-[80%] sm:w-full max-w-xl mx-auto mt-10 bg-zinc-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg ">
      <h2 className="text-xl font-semibold text-white mb-4">Edit Link</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Is Active</label>
          <select
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
            value={String(formData.isActive)}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === "true" })
            }
          >
            <option value="true">Active</option>
            <option value="false">Not Active</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Order</label>
          <input
            type="number"
            min={1}
            max={linksLength}
            value={formData.order}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= linksLength && value >= 1) {
                setFormData({ ...formData, order: value });
              }
            }}
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
            required
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
