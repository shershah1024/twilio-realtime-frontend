import { useState, useEffect } from "react";

const BACKEND_URL = "https://llm-call-1.vercel.app";

// Custom hook to fetch backend tools repeatedly
export function useBackendTools(intervalMs: number) {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTools = () => {
      fetch(`${BACKEND_URL}/tools`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setTools(data);
        })
        .catch((error) => {
          // On failure, we just let it retry after interval
          console.error("Error fetching backend tools:", error);
        });
    };

    fetchTools();
    const intervalId = setInterval(fetchTools, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return tools;
}
