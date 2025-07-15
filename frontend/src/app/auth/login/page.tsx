"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import NeonButton from "@/components/NeonButton";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { handleLogin } from "@/apis/authApi";
import toast from "react-hot-toast";
import { useUserStore } from "@/stores/userStore";
import { AxiosError } from "axios";
import { ZodErrorItem } from "../signup/page";
import { useAuthTokenStore } from "@/stores/tokenStore";

export type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { setUser } = useUserStore();
  const { setAccessToken } = useAuthTokenStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (formData: LoginFormData) => handleLogin(formData),
    onSuccess: (data) => {
      const { accessToken, user } = data.data;
      toast.success("Login successful!");
      setUser(user);
      setAccessToken(accessToken);
      window.location.href = "/dashboard";
    },
    onError: (error: AxiosError<{ error: ZodErrorItem[] | string }>) => {
      const errData = error.response?.data?.error;

      if (Array.isArray(errData)) {
        errData.forEach((err) => {
          if (typeof err.message === "string") {
            toast.error(err.message);
          }
        });
      } else if (typeof errData === "string") {
        toast.error(errData);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
    onSettled: () => {
      setFormData({ email: "", password: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 -mt-16">
      <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Welcome Back to <span className="text-emerald-400">Link Hive</span>
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-white">Email</label>
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm mb-1  text-white">Password</label>
            <input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
              required
            />
            <button
              type="button"
              className="absolute top-8 right-3 text-zinc-400 hover:text-emerald-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <NeonButton
            disabled={loginMutation.isPending}
            type="submit"
            text={loginMutation.isPending ? "Logging In..." : "Log In"}
            color="emerald"
            full
            pulse
          />
        </form>

        <p className="text-sm text-center text-zinc-400 mt-4">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-emerald-300 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
