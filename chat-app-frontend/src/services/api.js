import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export const roomApi = {
  createRoom: (roomId) =>
    api.post("/rooms", roomId, {
      headers: { "Content-Type": "text/plain" },
    }),

  joinRoom: (roomId) => api.get(`/rooms/${roomId}`),

  getMessages: (roomId, page = 0, size = 20) =>
    api.get(`/rooms/${roomId}/messages`, { params: { page, size } }),

  toggleReaction: (roomId, messageId, emoji, username) =>
    api.post(`/rooms/${roomId}/messages/${messageId}/reactions`, {
      messageId,
      emoji,
      username,
    }),
};
