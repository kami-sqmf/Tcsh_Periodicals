import { Notification } from "@/types/firestore";
import { db } from "@/utils/firebase";
import { getDocsFromCacheOrServer } from "@/utils/get-firestore";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NotificationElement } from "./notification";

async function getNotifications() {
  const notifications = await getDocsFromCacheOrServer<Notification[]>("notifications", "order", true);
  return notifications;
}

const NotificationWrapper = async ({ className, notificationsImported }: { className: string; notificationsImported?: Notification[] }) => {
  const notifications = notificationsImported ? notificationsImported : await getNotifications();
  return (
    <div className={`${className} flex flex-col space-y-2`}>
      {notifications.map((noti, i) => (
        <NotificationElement key={i} noti={noti} />
      ))}
    </div>
  )
}

export const revalidate = 150;
export { NotificationWrapper };
