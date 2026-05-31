import { useState, useEffect, useCallback } from "react";
import { roomApi } from "../services/api";
import { connectWebSocket, sendMessage, disconnectWebSocket } from "../services/websocket";

export const useChat = (roomId, username) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMessages = useCallback(async (pageNum = 0) => {
    try {
      const res = await roomApi.getMessages(roomId, pageNum, 20);
      const fetched = res.data;
      if (pageNum === 0) {
        setMessages(fetched);
      } else {
        setMessages((prev) => [...fetched, ...prev]);
      }
      if (fetched.length < 20) setHasMore(false);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    await loadMessages(next);
  }, [hasMore, loading, page, loadMessages]);

  const send = useCallback((content) => {
    sendMessage({ roomId, sender: username, content });
  }, [roomId, username]);

  useEffect(() => {
    if (!roomId || !username) return;

    queueMicrotask(() => loadMessages(0));

    connectWebSocket({
      roomId,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onMessage: (msg) => setMessages((prev) => [...prev, msg]),
    });

    return () => disconnectWebSocket();
  }, [roomId, username, loadMessages]);

  return { messages, connected, loading, hasMore, send, loadMore };
};
