import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
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
};