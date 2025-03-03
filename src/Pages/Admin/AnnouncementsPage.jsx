// To Do
// Remove the scroll wheel or use MUI imported components to make that easier

import ExpandableSearchBar from "../../Components/ExpandableSearchBar";


//Added Categorized announcements
const Category = ({ category, announcements }) => {
  return (
    <div className="space-y-4 w-full mb-14">
      <h1>{category}</h1>
      <div className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide ">
        {announcements.map((announcement) => (
          <Announcement announcement={announcement} />
        ))}
      </div>
    </div>
  );
};
const Announcement = ({ announcement }) => {
  
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
    <div
      key={announcement.id}
      className="p-4 border rounded shadow-sm w-96 shrink-0 h-40 secondaryBg"
    >
      <h2 className="text-xl font-semibold">{announcement.title}</h2>
      <p className="text-sm text-gray-500">{announcement.date}</p>
      <p className="mt-2">{shortenedAnnouncement(announcement.content)}</p>
    </div>
  );
};

const AnnouncementsManagementPage = () => {
  //the categories can be changed once we have an idea of the different ones to use
  const categories = ["Pinned", "Latest", "Security", "Shtuff"];
  
  // added a bit more announcements with a new category section
  const announcements = [
    {
      id: 1, // identifies the announcement
      title: "Scheduled power outage",
      date: "February 20, 2025",
      category: "Pinned",
      content:
        "Due to maintenance on the schools generators, there will be a power outage from 11pm - 5am till further notice, Please prepare accordingly and make necessary arrangements.",
    },
    {
      id: 1, // identifies the announcement
      title: "Scheduled power outage",
      date: "February 20, 2025",
      category: "Pinned",
      content:
        "Due to maintenance on the schools generators, there will be a power outage from 11pm - 5am till further notice, Please prepare accordingly and make necessary arrangements.",
    },
    {
      id: 1, // identifies the announcement
      title: "Scheduled power outage",
      date: "February 20, 2025",
      category: "Pinned",
      content:
        "Due to maintenance on the schools generators, there will be a power outage from 11pm - 5am till further notice, Please prepare accordingly and make necessary arrangements.",
    },
    {
      id: 1, // identifies the announcement
      title: "Scheduled power outage",
      date: "February 20, 2025",
      category: "Latest",
      content:
        "Due to maintenance on the schools generators, there will be a power outage from 11pm - 5am till further notice, Please prepare accordingly and make necessary arrangements.",
    },
    {
      id: 1, // identifies the announcement
      title: "Scheduled power outage",
      date: "February 20, 2025",
      category: "Shtuff",
      content:
        "Due to maintenance on the schools generators, there will be a power outage from 11pm - 5am till further notice, Please prepare accordingly and make necessary arrangements.",
    },
    {
      id: 2,
      title: "Hall worship",
      date: "February 15, 2025",
      category: "Security",
      content:
        "Hall worship holds every tuesday from 6:10pm - 7:10pm. Please be punctual as signing in ends by 6:25pm.",
    },
  ];
  return (
    <main className="p-8 flex flex-col items-center md:px-20 sm:px-14 -z-30">
      <h1 className="mb-8">Announcements</h1>
      <button className="mt-4 mr-4 border tertiaryBg border-gray-700 p-3 py-2 rounded fixed z-20 bottom-10 right-10 self-end">
          New Announcement
        </button>
      {categories.map((cat) => {
        const catAnnouncements = announcements.filter(
          (ann) => cat === ann.category
        );
        // Category Component
        return <Category category={cat} announcements={catAnnouncements} />;
      })}
    </main>
  );
};

export default AnnouncementsManagementPage; // Exporting the AnnouncementsPage component as the default export
