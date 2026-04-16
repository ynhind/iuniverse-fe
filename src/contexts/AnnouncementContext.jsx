import React, { createContext, useContext, useState } from "react";

const AnnouncementContext = createContext();

export function AnnouncementProvider({ children }) {
  const [announcements, setAnnouncements] = useState([
    {
      id: "a1",
      title: "System Maintenance",
      content: "The system will be down for maintenance this Sunday from 2 AM to 4 AM.",
      audience: "All", // "All", "Teachers", "Students"
      status: "Published",
      date: new Date().toISOString()
    }
  ]);

  const addAnnouncement = (announcement) => {
    setAnnouncements([{ ...announcement, id: Date.now().toString(), date: new Date().toISOString() }, ...announcements]);
  };

  const getAnnouncementsForUser = (role) => {
    return announcements.filter(a => a.audience === "All" || a.audience === role + "s");
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement, getAnnouncementsForUser }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncements() {
  return useContext(AnnouncementContext);
}
