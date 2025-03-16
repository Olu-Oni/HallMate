import React from "react";

const Request = ({ request, selected, onSelect }) => {
  const requestData = request || {
    id: Math.random().toString(36).substr(2, 9),
    type: "electrical",
    issue: "light bulbs",
    date: "21-02-2025",
    roomNo: "202",
  };

  return (
    <tr className={`transition-colors ${selected ? "" : ""}`}>
      <td className="w-fit px-2 ">
        <input
          type="checkbox"
          className="scale-150 cursor-pointer"
          checked={selected}
          onChange={(e) => onSelect(requestData.id, e.target.checked)}
        />
      </td>
      <td className="border-r-2 border-t-2 border-solid p-2">{requestData.type}</td>
      <td className="border-x-2 border-t-2 border-solid text-nowrap p-2">{requestData.issue}</td>
      <td className="border-x-2 border-t-2 border-solid p-2">{requestData.createdAt}</td>
      <td className="border-l-2 border-t-2 border-solid p-2">{requestData.roomNo}</td>
    </tr>
  );
};

export default Request;
