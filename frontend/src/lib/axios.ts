import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/userStore";
import { handleLogout } from "../apis/authApi";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.request.use(async (config) => {
  const { accessToken, setAccessToken, setUser, logout } =
    useAuthStore.getState();

  if (!accessToken) return config;

  try {
    const { exp } = jwtDecode<{ exp: number }>(accessToken);
    const now = Date.now() / 1000;

    if (exp - now < 60 && !isRefreshing) {
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
        config.headers.Authorization = `Bearer ${data.data.accessToken}`;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            await handleLogout();
            logout();
            throw err;
          }
        }
      } finally {
        isRefreshing = false;
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  } catch (err) {
    return config;
  }
});

export default api;
