import React from 'react';

const AnnouncementsPage = () => {
  const announcements = [
    {
      id: 1, // identifies the announcement
      title: "Scheduled power outage",
      date: "February 20, 2025",
      content: "Due to maintenance on the schools generators, there will be a power outage from 11pm - 5am till further notice, Please prepare accordingly and make necessary arrangements."
    },
    {
      id: 2,
      title: "Hall worship",
      date: "February 15, 2025",
      content: "Hall worship holds every tuesday from 6:10pm - 7:10pm. Please be punctual as signing in ends by 6:25pm."
    }
  ];

  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      <div className="space-y-4 w-full max-w-2xl">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold">{announcement.title}</h2>
            <p className="text-sm text-gray-500">{announcement.date}</p>
            <p className="mt-2">{announcement.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AnnouncementsPage; // Exporting the AnnouncementsPage component as the default export