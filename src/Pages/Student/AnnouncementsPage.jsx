import React, { useState, useEffect } from "react";
import ExpandableSearchBar from "../../Components/ExpandableSearchBar";
import { getAllAnnouncements } from "../../services/announcements";
import {
  Calendar,
  User,
  FileText,
} from "lucide-react";
//to display full announcement when clicked
const Modal = ({ announcement, onClose }) => {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="primaryBg p-6 rounded shadow-lg w-full max-w-2xl mx-4">
        <h2 className="text-xl font-semibold">{announcement.title}</h2>
        <p className="text-sm text-gray-500">{announcement.date}</p>
        <p className="mt-2">{announcement.content}</p>
        <button
          onClick={onClose}
          className="mt-4 secondaryBg m py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

//Added Categorized announcements
const Category = ({ category, announcements, onAnnouncementClick }) => {
  if (announcements.length === 0) return null;
  
  return (
    <div className="space-y-4 w-full mb-14 mt-6">
      <h1>{category}</h1>
      <div className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide pb-2">
        {announcements.map((announcement) => (
          <Announcement
            key={announcement.id}
            announcement={announcement}
            onClick={() => onAnnouncementClick(announcement)}
          />
        ))}
      </div>
    </div>
  );
};

// Modern Announcement Card
const Announcement = ({ announcement, onClick }) => {
  // Find category with highest priority for badge color
  const getPriorityCategory = () => {
    if (announcement.category.includes("Pinned")) return "Pinned";
    if (announcement.category.includes("Latest")) return "Latest";
    return announcement.category[0];
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Pinned":
        return "bg-red-100 text-red-800";
      case "Latest":
        return "bg-purple-100 text-purple-800";
      case "General Notice":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-orange-100 text-orange-800";
      case "Events":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const shortenContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;

    // Find the last space before maxLength
    const lastSpace = content.lastIndexOf(" ", maxLength);
    return content.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
  };

  const priorityCategory = getPriorityCategory();
  const categoryColor = getCategoryColor(priorityCategory);

  return (
    <div
      onClick={onClick}
      className="flex flex-col p-5 border rounded-lg shadow-sm hover:shadow-md transition-all secondaryBg w-72 md:w-80 shrink-0 h-52 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-lg font-bold line-clamp-1">{announcement.title}</h2>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColor}`}
        >
          {priorityCategory}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <Calendar size={12} />
        <span>{announcement.date}</span>
        {announcement.sender && (
          <>
            <span className="mx-1">•</span>
            <User size={12} />
            <span>{announcement.sender}</span>
          </>
        )}
      </div>

      <p className="text- text-sm flex-grow line-clamp-4">
        {shortenContent(announcement.content)}
      </p>

      {announcement.attachments && announcement.attachments.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <FileText size={12} />
          <span>
            {announcement.attachments.length} attachment
            {announcement.attachments.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

    </div>
  );
};


const AnnouncementsPage = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  const categories = [
    "Pinned",
    "Latest",
    "General Notice",
    "Maintenance",
    "Events",
  ];

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


  // Filter announcements based on search query
  // useEffect(() => {
  //   if (!searchQuery) {
  //     setFilteredAnnouncements(announcements);
  //     return;
  //   }
    
  //   const filtered = announcements.filter(
  //     (announcement) =>
  //       announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
    
  //   setFilteredAnnouncements(filtered);
  // }, [searchQuery, announcements]);

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  // };

  const filtered = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <main className="p-8 flex flex-col items-center md:px-20 sm:px-14 ">
      <h1 className="mb-4">Announcements</h1>
     
      <ExpandableSearchBar onSearch={null} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>

      
      {/* If there's a search query, show all results without categories */}
      {searchQuery ? (
        <div className="space-y-4 w-full mb-14">
          <h1 className="mt-10">Search Results</h1>
          <div className="flex flex-wrap gap-6">
            {filtered.length > 0 ? (
              filtered.map((announcement) => (
                <Announcement
                  key={announcement.id}
                  announcement={announcement}
                  onClick={() => setSelectedAnnouncement(announcement)}
                />
              ))
            ) : (
              <p >No announcements found matching "{searchQuery}"</p>
            )}
          </div>
        </div>
      ) : (
        /* Display by categories when not searching */
        categories.map((cat) => {
          const catAnnouncements = filtered.filter((ann) =>
            ann.category.includes(cat)
          );
          return (
            <Category
              key={cat}
              category={cat}
              announcements={catAnnouncements}
              onAnnouncementClick={setSelectedAnnouncement}
            />
          );
        })
      )}
      
      <Modal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </main>
  );
};

export default AnnouncementsPage;