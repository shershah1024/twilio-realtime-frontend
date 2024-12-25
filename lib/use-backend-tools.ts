import { useState, useEffect } from "react";

const BACKEND_URL = "wss://11ba371b-1391-4829-a844-e1f757857a0a-00-24kbo3yt9pnlk.pike.replit.dev";

// Custom hook to fetch backend tools repeatedly
export function useBackendTools(intervalMs: number) {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const ws = new WebSocket(BACKEND_URL);

    ws.onopen = () => {
      console.log("Connected to tools websocket");
      // Request tools when connection opens
      ws.send(JSON.stringify({ type: "tools.list" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "tools.list" && isMounted) {
        setTools(data.tools || []);
      }
    };

    ws.onclose = () => {
      console.log("Tools websocket disconnected");
    };

    // Set up polling through WebSocket
    const intervalId = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "tools.list" }));
      }
    }, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      ws.close();
    };
  }, [intervalMs]);

  return tools;
}
