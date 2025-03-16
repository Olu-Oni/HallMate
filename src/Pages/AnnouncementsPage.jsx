import React, { useEffect, useState } from 'react';
import { getAllAnnouncements } from '../services/announcements';

//to display full announcement when clicked
const Modal = ({ announcement, onClose }) => {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-semibold">{announcement.title}</h2>
        <p className="text-sm text-gray-500">{announcement.date}</p>
        <p className="mt-2">{announcement.content}</p>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

//Added Categorized announcements
const Category = ({ category, announcements, onAnnouncementClick }) => {
  return (
    <div className="space-y-4 w-full mb-14">
      <h1>{category}</h1>
      <div className="flex gap-6 overflow-x-auto overflow-y-hidden">
        {announcements.map((announcement) => (
          <Announcement key={announcement.id} announcement={announcement} onClick={() => onAnnouncementClick(announcement)} />
        ))}
      </div>
    </div>
  );
};

const Announcement = ({ announcement, onClick }) => {
  // shortening the content of each announcement if over 110 length
  const findNextIndex = (arr, char, start) => {
    for (let i = start; i < arr.length; i++) {
      if (arr[i] === char) {
        return i;
      }
    }
    return arr.length - 1;
  };

  const shortenedAnnouncement = (ann) => {
    if (ann.length >= 110) {
      const shortStart = findNextIndex(ann, " ", 110);
      const shortenedAnnouncement = ann.slice(0, shortStart);
      return shortenedAnnouncement + "  . . .";
    } else return ann;
  };

  return (
    <div onClick={onClick} className="p-4 border rounded shadow-sm w-96 shrink-0 h-40 secondaryBg cursor-pointer">
      <h2 className="text-xl font-semibold">{announcement.title}</h2>
      <p className="text-sm text-gray-500">{announcement.date}</p>
      <p className="mt-2">{shortenedAnnouncement(announcement.content)}</p>
    </div>
  );
};

const AnnouncementsPage = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const categories = ["Pinned", "Latest", "General Notice", "Maintenance", "Events"];
const [announcements, setAnnouncements] = useState([])
  
  // const announcements = [
  //   {
  //     id: 1, // identifies the announcement
  //     title: "Scheduled power outage",
  //     date: "February 20, 2025",
  //     category: ["Pinned", "Maintenance"],
  //     content:
  //       "Due to maintenance on the schools generators, there will be a power outage from 11pm - 5am till further notice, Please prepare accordingly and make necessary arrangements.",
  //   },
  //   {
  //     id: 2, // identifies the announcement
  //     title: "Scheduled Water Supply Interruption",
  //     date: "February 20, 2025",
  //     category: ["Pinned", "Maintenance"], 
  //     content:
  //       "Due to necessary plumbing maintenance, water supply will be temporarily unavailable from 9:00 AM to 3:00 PM in Blocks A and B. Please store enough water in advance.",
  //   },
  //   {
  //     id: 3, // identifies the announcement
  //     title: "Hall week",
  //     date: "February 20, 2025",
  //     category: ["Pinned" ,"Events"],
  //     content:
  //       "Hall week begins on saturday the 15th between 9AM and 4:30PM. Please prepare yourselves, organise your rooms and remain fully dressed at all times.",
  //   },
  //   {
  //     id: 4, // identifies the announcement
  //     title: "Check-Out Procedure for End of Semester",
  //     date: "February 20, 2025",
  //     category: ["Latest","General Notice"],
  //     content:
  //       "All students must complete the check-out process and vacate the hall of residence by April 30. Please return your room keys to the porters and ensure your room is cleaned before departure. Failure to do so may result in your page being blocked.",
  //   },
  //   {
  //     id: 5, // identifies the announcement
  //     title: "Hall worship",
  //     date: "February 20, 2025",
  //     category: ["Events"],
  //     content:
  //       "Hall worship holds every tuesday from 6:10pm - 7:10pm. Please be punctual as signing in ends by 6:25pm.",
  //   },
  //   {
  //     id: 6,
  //     title: "Sabbath hours",
  //     date: "February 15, 2025",
  //     category: ["Events"],
  //     content:
  //       "As we are all aware, sabbath begins 5pm on fridays till 7pm saturday, Please remove all clothes from the line, Refrain from using your laptops and playing loud music, always remember to keep the sabbath day holy.",
  //   },
  //   {
  //     id: 7,
  //     title: "Room Inspection",
  //     date: "March 25, 2025",
  //     category: ["General Notice"],
  //     content:
  //       "Routine room inspections will take place from 10:00 AM to 4:00 PM. Please ensure your rooms are clean and comply with hostel regulations. Any violations may result in demertis.",
  //   },
  //   {
  //     id: 8,
  //     title: "Curfew Reminder",
  //     date: "March 27, 2025",
  //     category: ["General Notice"],
  //     content:
  //       "General reminder that curfew remains 9:45pm, please return to the hall before the afore mentioned time ",
  //   },
  // ];

    useEffect(() => {
      getAllAnnouncements()
            .then((response) => {
              setAnnouncements(response)
              console.log(announcements)
            })
            .catch((error) => console.error("Error fetching students:", error))
        
    }, []);
  

  return (
    <main className="p-8 flex flex-col items-center md:px-20 sm:px-14">
      <h1 className="mb-8">Announcements</h1>
      {categories.map((cat) => {
        const catAnnouncements = announcements.filter(
          (ann) => ann.category.includes(cat)
        );
        return <Category key={cat} category={cat} announcements={catAnnouncements} onAnnouncementClick={setSelectedAnnouncement} />;
      })}
      <Modal announcement={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />
    </main>
  );
};

export default AnnouncementsPage;
