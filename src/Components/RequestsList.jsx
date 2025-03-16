import React from "react";
import Request from "./Request";

const RequestsList = ({ categoryRequests, selectedRequests, setSelectedRequests }) => {
  const filteredRequests = categoryRequests || [];

  const handleSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedRequests((prev) => [...prev, id]);
    } else {
      setSelectedRequests((prev) => prev.filter((requestId) => requestId !== id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1 text-sm border-b min-w-[550px]">
        <thead>
          <tr className="secondaryBg">
            <td className="w-fit px-2 primaryBg">
              <input
                type="checkbox"
                className="scale-[150%] cursor-pointer"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRequests(filteredRequests.map((req) => req.id));
                  } else {
                    setSelectedRequests([]);
                  }
                }}
                checked={
                  filteredRequests.length > 0 &&
                  filteredRequests.every((req) => selectedRequests.includes(req.id))
                }
              />
            </td>
            <td className="border-2 p-2 font-semibold text-nowrap">Request Type</td>
            <td className="border-2 p-2 font-semibold">Issue</td>
            <td className="border-2 p-2 font-semibold text-nowrap">Date Requested</td>
            <td className="border-2 p-2 font-semibold">Room</td>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((req) => (
            <Request
              key={req.id}
              request={req}
              selected={selectedRequests.includes(req.id)}
              onSelect={handleSelect}
            />
          ))}
          {filteredRequests.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsList;
