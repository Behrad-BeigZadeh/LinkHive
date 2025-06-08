import api from "@/lib/axios";

export const createLink = async (formData: { title: string; url: string }) => {
  try {
    const res = await api.post("/api/links", formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const editLink = async (
  linkId: string,
  formData: { title: string; url: string; isActive: boolean; order: number }
) => {
  try {
    const res = await api.patch(`/api/links/${linkId}`, formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUserLinks = async () => {
  try {
    const res = await api.get("/api/links");

    return res.data.links || [];
  } catch (error) {
    throw error;
  }
};

export const deleteLink = async (linkId: string) => {
  try {
    const res = await api.delete(`/api/links/${linkId}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const reorderLinks = async (
  linkUpdates: { id: string; order: number }[]
) => {
  try {
    const res = await api.patch("/api/links/reorder", linkUpdates);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPublicProfile = async (username: string) => {
  try {
    const res = await api.get(`/api/links/public/${username}`);
    return res.data.profile;
  } catch (error) {
    throw error;
  }
};

export const trackClicks = async (linkId: string) => {
  try {
    const res = await api.post(`/api/links/${linkId}/click`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
