import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = ({ roomId, onMessage, onActivity, onConnect, onDisconnect }) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/chat"),

    onConnect: () => {
      stompClient.subscribe(`/topic/room/${roomId}`, (frame) => {
        const message = JSON.parse(frame.body);
        onMessage?.(message);
      });

      stompClient.subscribe(`/topic/activity/${roomId}`, (frame) => {
        const activity = JSON.parse(frame.body);
        onActivity?.(activity);
      });

      onConnect?.();
    },

    onDisconnect: () => onDisconnect?.(),

    onStompError: (frame) => console.error("STOMP error:", frame),
  });

  stompClient.activate();
};

export const sendMessage = ({ roomId, sender, content }) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: `/app/sendMessage/${roomId}`,
    body: JSON.stringify({ roomId, sender, content }),
  });
};

export const sendActivity = ({ roomId, username, type }) => {
  if (!stompClient?.connected) return;
  stompClient.publish({
    destination: `/app/activity/${roomId}`,
    body: JSON.stringify({ roomId, username, type }),
  });
};

export const disconnectWebSocket = () => {
  stompClient?.deactivate();
  stompClient = null;
};
