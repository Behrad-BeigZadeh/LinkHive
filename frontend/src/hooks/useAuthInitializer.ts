import { useEffect } from "react";
import axios from "axios";
import { handleLogout } from "../apis/authApi";
import { useAuthStore } from "../stores/userStore";

export const useAuthInitializer = () => {
  const { setAccessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            await handleLogout();
            logout();
          }
        }
      }
    };

    tryRefresh();
  }, []);
};
