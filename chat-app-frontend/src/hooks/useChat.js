import { useState, useEffect, useCallback } from "react";
import { roomApi } from "../services/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendActivity,
  sendMessage,
} from "../services/websocket";

export const useChat = (roomId, username) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([username]);
  const [typingUsers, setTypingUsers] = useState([]);

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

  const sendUserActivity = useCallback((type) => {
    sendActivity({ roomId, username, type });
  }, [roomId, username]);

  const sendTyping = useCallback(() => {
    sendUserActivity("TYPING");
  }, [sendUserActivity]);

  const sendStopTyping = useCallback(() => {
    sendUserActivity("STOP_TYPING");
  }, [sendUserActivity]);

  const sendLeave = useCallback(() => {
    sendUserActivity("LEAVE");
  }, [sendUserActivity]);

  useEffect(() => {
    if (!roomId || !username) return;

    queueMicrotask(() => loadMessages(0));

    connectWebSocket({
      roomId,
      onConnect: () => {
        setConnected(true);
        sendUserActivity("JOIN");
      },
      onDisconnect: () => setConnected(false),
      onMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onActivity: (activity) => {
        const activityUsername = activity.username;

        if (Array.isArray(activity.onlineUsers)) {
          setOnlineUsers(activity.onlineUsers);
        }

        if (!activityUsername || activityUsername === username) return;

        if (activity.type === "TYPING") {
          setTypingUsers((prev) => (
            prev.includes(activityUsername) ? prev : [...prev, activityUsername]
          ));
          return;
        }

        if (activity.type === "STOP_TYPING" || activity.type === "LEAVE") {
          setTypingUsers((prev) => prev.filter((name) => name !== activityUsername));
        }
      },
    });

    const handleBeforeUnload = () => {
      sendUserActivity("LEAVE");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendUserActivity("LEAVE");
      disconnectWebSocket();
    };
  }, [roomId, username, loadMessages, sendUserActivity]);

  return {
    messages,
    connected,
    loading,
    hasMore,
    onlineUsers,
    typingUsers,
    send,
    sendTyping,
    sendStopTyping,
    sendLeave,
    loadMore,
  };
};
