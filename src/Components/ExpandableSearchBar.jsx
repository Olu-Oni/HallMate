import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

const ExpandableSearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  // State to track if the search bar is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // State to track the search query as the user types
//   const [searchQuery, setSearchQuery] = useState("");

  // Reference to the input field (for auto-focus when expanding)
  const inputRef = useRef(null);

  // Reference to the search bar container (for detecting clicks outside)
  const containerRef = useRef(null);

  // Function to toggle the search bar open/close
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    
    if (!isExpanded) {
      // Delay focus slightly to ensure input is visible before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Function to handle input change and trigger live search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Effect to close the search bar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    // Attach event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full mr-2 mb-8">
      <div
        className={` flex h-12 items-center secondaryBg backdrop-blur-md transition-all duration-300 ease-in-out border-2 border-gray-300 rounded-full ${
          isExpanded ? "w-[80%] md:w-96 px-4 py-2" : "w-12 "
        }`}
      >
        {/* Search Icon Button (Expands Search Bar on Click) */}
        <button
          type="button"
          onClick={handleToggle}
          className={`absolute ${isExpanded ?"left-3": "left-1"} p-2  rounded-full  focus:outline-none `}
          aria-label={isExpanded ? "Collapse search" : "Expand search"}
        >
          <Search size={20} />
        </button>

        {/* Input Field for Searching */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`w-full pl-12 pr-4 py-2  bg-transparent rounded-full focus:outline-none transition-all duration-300 ${
            isExpanded ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

export default ExpandableSearchBar;
