import React, { useState } from 'react';
import RequestsList from './RequestsList';
import { Check } from 'lucide-react';


 const RequestCategory = ({
    categoryName,
    requests,
    selectedRequests,
    setSelectedRequests,
    onEdit,
    onDelete,
    onChangeStatus,
  }) => {
    // State for expanding request section
    const [expand, setExpand] = useState(true);
    // State for status change dropdown visibility
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
    // Filter requests for this category
    const categoryRequests = requests?.filter(
      (req) => req.status === categoryName
    );
  
    // Get selected requests for this category
    const selectedCategoryRequests =
      categoryRequests
        ?.filter((req) => selectedRequests.includes(req.id))
        ?.map((req) => req.id) || [];
  
    return (
      <div
        className={`${
          !expand ? "overflow-hidden" : ""
        } mb-6 border border-gray-200 rounded-lg shadow-sm`}
      >
        <div className="secondaryBg rounded-t-lg flex justify-between items-center">
          <button
            onClick={() => setExpand(!expand)}
            className="  flex-grow flex items-center gap-3 p-4 text-left hover:brightness-[85%] transition-colors"
          >
            <div
              className={`transition-transform duration-300 ${
                expand ? "rotate-180" : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="font-bold text-lg">{categoryName}</h2>
          </button>
  
          {/* Status change button */}
          {selectedCategoryRequests.length > 0 && (
            <div className="relative px-4">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-1 py-2 px-2 text-blue-500 hover:bg-blue-100 rounded-md transition-colors"
              >
                <span>
                  Change Status{" "}
                  {selectedCategoryRequests.length > 1
                    ? `(${selectedCategoryRequests.length})`
                    : ""}
                </span>
              </button>
  
              {/* Status change dropdown */}
              {showStatusDropdown && (
                <div className="absolute right-4 top-full mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 p-2 min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    {["Pending", "Reviewed", "Completed", "Cancelled"]
                      .filter((status) => status !== categoryName)
                      .map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            onChangeStatus(selectedCategoryRequests, status);
                            setShowStatusDropdown(false);
                          }}
                          className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded text-left"
                        >
                          <Check size={16} className="text-blue-500" />
                          <span>{status}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
  
        {expand && (
          <div className="p-4">
            <RequestsList
              categoryRequests={categoryRequests}
              selectedRequests={selectedRequests}
              setSelectedRequests={setSelectedRequests}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>
    );
  };
  
  export default RequestCategory