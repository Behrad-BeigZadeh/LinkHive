"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { handleSignup } from "@/apis/authApi";
import { AxiosError } from "axios";
import NeonButton from "@/components/NeonButton";
import { useAuthTokenStore } from "@/stores/tokenStore";
import { useUserStore } from "@/stores/userStore";

export type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type ZodErrorItem = { message: string };

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { setUser } = useUserStore();
  const { setAccessToken } = useAuthTokenStore();

  const signupMutation = useMutation({
    mutationFn: (formData: SignupFormData) => handleSignup(formData),
    onSuccess: (data) => {
      const { accessToken, user } = data.data;
      toast.success("Signup successful!");
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
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    signupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-16 px-4  text-white">
      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-fuchsia-400">
          Sign up for Link Hive
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              type="text"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">Password</label>
            <input
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-zinc-400 hover:text-fuchsia-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              type={showConfirm ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-9 right-3 text-zinc-400 hover:text-fuchsia-400"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <NeonButton
            disabled={signupMutation.isPending}
            full
            type="submit"
            color="fuchsia"
            text={signupMutation.isPending ? "Signing up..." : "Sign Up"}
            pulse
          />
          <p className="text-sm text-center text-zinc-400 mt-4">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-fuchsia-400 hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
