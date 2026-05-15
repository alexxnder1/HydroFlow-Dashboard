import { LocalNotifications } from "@capacitor/local-notifications";

export interface Notification {
    title: string,
    body: string,
    timestamp: number
}

export async function SetupNotifications() {
    await LocalNotifications.createChannel({
      id: 'hydro-channel', 
      name: 'Irigare HydroFlow',
      importance: 5, 
      description: 'Notificări sistem irigare',
      sound: 'default',
      visibility: 1,
      vibration: true,
    });

    await LocalNotifications.requestPermissions();
}

export async function SendNotification(notif : Notification) {
    await LocalNotifications.schedule({
       notifications: [
         {
           title: notif.title,
           body: notif.body,
           id: Math.floor(Math.random() * 10000),
           channelId: 'hydro-channel',
           sound: 'default',
         }
       ]
    });
}