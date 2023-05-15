import { Notification } from "@/types/firestore";
import { getNotifications } from "@/utils/get-firestore";
import { NotificationElement } from "./notification";



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

export const revalidate = 300;
export { NotificationWrapper };
