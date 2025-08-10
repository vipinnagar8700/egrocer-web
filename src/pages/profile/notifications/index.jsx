import MetaData from "@/components/metadata-component/MetaData";
const NotificationsPage = dynamic(()=>import("@/components/pagecomponents/NotificationsPage"),{ssr:false})
import dynamic from "next/dynamic";
import React from "react";

const Notifications = () => {
  return (
    <div>
      <MetaData pageName="/profile/notifications" title={`Notifications - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
      <NotificationsPage />
    </div>
  );
};

export default Notifications;
