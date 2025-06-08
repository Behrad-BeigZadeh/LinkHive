import { LoginFormData } from "@/app/auth/login/page";
import { SignupFormData } from "@/app/auth/signup/page";
import api from "@/lib/axios";

export const handleLogin = async (formData: LoginFormData) => {
  try {
    const res = await api.post("/api/auth/login", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const handleSignup = async (formData: SignupFormData) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToSend } = formData;
    const res = await api.post("/api/auth/signup", dataToSend, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    const res = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const editProfile = async (formData: FormData) => {
  try {
    const res = await api.patch("/api/links/public/profile", formData);

    return res.data.profile;
  } catch (error) {
    throw error;
  }
};
