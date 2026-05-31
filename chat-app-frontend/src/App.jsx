import { ChatProvider } from "./contexts/ChatContext";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  );
}