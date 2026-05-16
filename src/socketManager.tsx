import { STA_IP } from "./App";
import { SendNotification, type Notification } from "./notifications";

var socket: WebSocket;

export function SocketClose()
{
    socket.close();
}

export function SocketSetup()
{
    socket = new WebSocket(`ws://${STA_IP}/ws`);
    socket.onopen = () => {
      console.log("[WebSocket React] Connected to ESP32.");
    };
    socket.onclose = (e) => {
      setTimeout(SocketSetup, 3000); 
    };

    socket.onerror = (err) => {
      console.error("Error Socket:", err);
      socket?.close(); 
    };

    socket.onmessage = async (event: MessageEvent) => {
        const data: string = event.data;
        console.log("Message ESP32: ", data);
        if (data.includes("[NOTIFICATION]")) 
        {
          const notifJson = data.replace("[NOTIFICATION]", "").trim();
          try {
              var notification = JSON.parse(notifJson) as Notification;
              SendNotification(notification);
              console.log("Notification sent to system!");
          } catch (error) {
              console.error("Error schedule:", error);
        }
      }
    }
            
}