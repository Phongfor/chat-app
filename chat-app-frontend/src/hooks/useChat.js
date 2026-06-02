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
  const [replyTo, setReplyTo] = useState(null);

  const syncMessages = useCallback(async () => {
    if (!roomId) return;

    try {
      const size = Math.max(messages.length, 20);
      const res = await roomApi.getMessages(roomId, 0, size);
      const fetched = res.data;
      setMessages(fetched);
      if (fetched.length < size) setHasMore(false);
    } catch (err) {
      console.error("Failed to sync messages:", err);
    }
  }, [messages.length, roomId]);

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
    sendMessage({
      roomId,
      sender: username,
      content,
      replyToId: replyTo?.id,
      replyToContent: replyTo?.content,
      replyToSender: replyTo?.sender,
    });
    setReplyTo(null);
  }, [roomId, username, replyTo]);

  const startReply = useCallback((message) => {
    setReplyTo({
      id: message.id,
      content: message.content,
      sender: message.sender,
    });
  }, []);

  const cancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const toggleReaction = useCallback(async (message, emoji) => {
    if (!message?.id) return;

    const previousMessages = messages;
    setMessages((prev) => prev.map((item) => {
      if (item.id !== message.id) return item;

      const reactions = { ...(item.reactions || {}) };
      const users = [...(reactions[emoji] || [])];
      const existingUserIndex = users.indexOf(username);

      if (existingUserIndex >= 0) {
        users.splice(existingUserIndex, 1);
      } else {
        users.push(username);
      }

      if (users.length) {
        reactions[emoji] = users;
      } else {
        delete reactions[emoji];
      }

      return { ...item, reactions };
    }));

    try {
      await roomApi.toggleReaction(roomId, message.id, emoji, username);
      await syncMessages();
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
      setMessages(previousMessages);
    }
  }, [messages, roomId, syncMessages, username]);

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

  useEffect(() => {
    if (!roomId || !username) return undefined;

    const syncTimer = setInterval(syncMessages, 3000);
    return () => clearInterval(syncTimer);
  }, [roomId, syncMessages, username]);

  return {
    messages,
    connected,
    loading,
    hasMore,
    onlineUsers,
    typingUsers,
    replyTo,
    send,
    startReply,
    cancelReply,
    toggleReaction,
    sendTyping,
    sendStopTyping,
    sendLeave,
    loadMore,
  };
};
