"use client";

import React, { useState, useEffect } from "react";
import TopBar from "@/components/top-bar";
import SessionConfigurationPanel from "@/components/session-configuration-panel";
import Transcript from "@/components/transcript";
import FunctionCallsPanel from "@/components/function-calls-panel";
import { Item } from "@/components/types";
import handleRealtimeEvent from "@/lib/handle-realtime-event";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const BACKEND_URL = "wss://llm-call-1.vercel.app";

const CallInterface = () => {
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("+12184757309");
  const [items, setItems] = useState<Item[]>([]);
  const [callStatus, setCallStatus] = useState("disconnected");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!ws) {
      const newWs = new WebSocket(BACKEND_URL);

      newWs.onopen = () => {
        console.log("Connected to logs websocket");
        setCallStatus("connected");
      };

      newWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received logs event:", data);
        handleRealtimeEvent(data, setItems);
      };

      newWs.onclose = () => {
        console.log("Logs websocket disconnected");
        setWs(null);
        setCallStatus("disconnected");
      };

      setWs(newWs);
    }
  }, [ws]);

  const startCall = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const startCallEvent = {
        type: "call.start",
        phoneNumber: selectedPhoneNumber,
      };
      console.log("Starting call:", startCallEvent);
      ws.send(JSON.stringify(startCallEvent));
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <TopBar />
      <div className="flex-grow p-4 h-full overflow-hidden flex flex-col">
        <div className="mb-4 flex justify-end">
          <Button 
            onClick={startCall}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Start Call
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Column */}
          <div className="col-span-3 flex flex-col h-full overflow-hidden">
            <SessionConfigurationPanel
              callStatus={callStatus}
              onSave={(config) => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                  const updateEvent = {
                    type: "session.update",
                    session: {
                      ...config,
                      phoneNumber: selectedPhoneNumber,
                    },
                  };
                  console.log("Sending update event:", updateEvent);
                  ws.send(JSON.stringify(updateEvent));
                }
              }}
            />
          </div>

          {/* Middle Column: Transcript */}
          <div className="col-span-6 flex flex-col gap-4 h-full overflow-hidden">
            <Transcript items={items} />
          </div>

          {/* Right Column: Function Calls */}
          <div className="col-span-3 flex flex-col h-full overflow-hidden">
            <FunctionCallsPanel items={items} ws={ws} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
