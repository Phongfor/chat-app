/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const enterRoom = (rid, uname) => {
    setRoomId(rid);
    setUsername(uname);
  };

  const leaveRoom = () => {
    setRoomId("");
    setUsername("");
  };

  return (
    <ChatContext.Provider value={{ roomId, username, enterRoom, leaveRoom }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
};
