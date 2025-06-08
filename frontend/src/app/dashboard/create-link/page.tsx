"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NeonButton from "@/components/NeonButton";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createLink } from "@/apis/linksApi";
import { AxiosError } from "axios";

export default function CreateLinkPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const mutation = useMutation({
    mutationFn: () => createLink({ title, url }),

    onSuccess: () => {
      toast.success("Link created!");
      router.push("/dashboard");
      setTitle("");
      setUrl("");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      if (error.response?.data?.error) {
        const errors = error.response.data.error;

        if (Array.isArray(errors)) {
          errors.forEach((err) => {
            toast.error(err.message || "Validation error");
          });
        } else if (typeof errors === "string") {
          toast.error(errors);
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Failed to create link");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="w-[80%] sm:w-full max-w-xl mx-auto mt-10 bg-zinc-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg  ">
      <h2 className="text-xl font-semibold text-white mb-4">Create New Link</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-white/10 text-white outline-none"
            required
          />
        </div>

        <NeonButton
          type="submit"
          text={mutation.isPending ? "Creating..." : "Create Link"}
          color="emerald"
          full
          disabled={mutation.isPending}
          pulse
        />
      </form>
    </div>
  );
}
