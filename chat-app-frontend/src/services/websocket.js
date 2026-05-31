import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = ({ roomId, onMessage, onConnect, onDisconnect }) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/chat"),

    onConnect: () => {
      onConnect?.();
      stompClient.subscribe(`/topic/room/${roomId}`, (frame) => {
        const message = JSON.parse(frame.body);
        onMessage?.(message);
      });
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

export const disconnectWebSocket = () => {
  stompClient?.deactivate();
  stompClient = null;
};