import React, { useEffect, useState } from 'react';
import { getAllAnnouncements } from '../services/announcements';

// Modal component to display full announcement details when clicked
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

// Category component to display announcements by category
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

// Announcement component to display individual announcement
const Announcement = ({ announcement, onClick }) => {
  // Function to find the next index of a character in a string
  const findNextIndex = (arr, char, start) => {
    for (let i = start; i < arr.length; i++) {
      if (arr[i] === char) {
        return i;
      }
    }
    return arr.length - 1;
  };

  // Function to shorten the content of an announcement if it exceeds 110 characters
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

// Main component for displaying announcements
const AnnouncementsPage = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // State to store the selected announcement for the modal
  const [announcements, setAnnouncements] = useState([]); // State to store all announcements

  const categories = ["Pinned", "Latest", "General Notice", "Maintenance", "Events"]; // Categories for announcements

  // Fetch all announcements when the component mounts
  useEffect(() => {
    getAllAnnouncements()
      .then((response) => {
        setAnnouncements(response);
        console.log(announcements);
      })
      .catch((error) => console.error("Error fetching announcements:", error));
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
