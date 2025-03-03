import React, { useState, useEffect } from "react";
import dropdownIcon from "../../assets/dropDownIcon.png";

const Request = ({ request }) => {
  return (
    <tr className="">
      <td className="w-fit">
        {" "}
        <input type="checkbox" className="scale-150" />
      </td>
      <td className="border-r-2 border-t-2  border-solid">electrical</td>
      {/* <td className="border-x-2 border-solid">Request </td> */}
      <td className="border-x-2 border-t-2  border-solid text-nowrap">light bulbs</td>
      <td className="border-x-2 border-t-2  border-solid">21-02-2025</td>
      <td className="border-l-2 border-t-2  border-solid">202</td>
    </tr>
  );
};

const RequestsList = () => {
  return (
    <table className="border-separate border-spacing-1 text-sm border-b">
      <thead>
        <tr className=" ">
          <td className="w-fit">
            {" "}
            <input type="checkbox" className="scale-[200%] secondaryBg" />
          </td>
          <td className="border-2  secondaryBg ">Request Type</td>
          {/* <td className="border-2 secondaryBg">Request </td> */}
          <td className="border-2  secondaryBg">Issue</td>
          <td className="border-2 secondaryBg">Date Requested</td>
          <td className="border-2 secondaryBg">Room</td>
        </tr>
      </thead>

      <tbody>
        <Request />
        <Request />
        <Request />
      </tbody>
    </table>
  );
};

const RequestCategory = ({ categoryName }) => {
  // State for expanding request section
  const [expand, setExpand] = useState(false);
  const style = expand ? { maxHeight: "80px" } : null;
  const style2 = expand ? null : { transform: "rotate(180deg)" };
  return (
    <div style={style} className="overflow-hidden mb-10">
      <button
        onClick={() => setExpand(!expand)}
        className={`${expand?'outline outline-2':null} mx-2 w-full flex gap-8 tertiaryBg  p-4 py-2 my-4 rounded-md `}
      >
        <img className="w-5 h-5 mt-1 z-20" src={dropdownIcon} style={style2} />
        <h2 className="text-gray-600 font-bold text-lg">{categoryName}</h2>
      </button>
      <div className="overflow-x-auto">
        <RequestsList />
      </div>
    </div>
  );
};
const RequestsManagementPage = () => {
  // State for new maintenance request
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    roomNo: "",
    amenity: "",
    issue: "",
    otherIssue: "",
    status: "Pending",
  });
  

  const resetNewRequest = () => {
    setNewRequest({
      roomNo: student?.displayInfo?.roomNo || "",
      amenity: "",
      issue: "",
      otherIssue: "",
      status: "Pending",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      id: requests.length + 1,
      roomNo: newRequest.roomNo,
      amenity: newRequest.amenity,
      issue:
        newRequest.amenity === "others"
          ? newRequest.otherIssue
          : newRequest.issue,
      status: "Pending",
    };

    setRequests([...requests, newEntry]); // Update request list
    resetNewRequest(); // Reset form
    console.log("Request submitted:", newEntry);

    // TODO: Send request to the hall admin (API call)};
  };

  const issues = {
    electrical: ["fans", "sockets", "light bulbs"],
    plumbing: ["wash hand basin", "shower", "tap", "wc"],
    carpentry: ["broken beds", "damaged lockers", "damaged doors"],
  };

  return (
    <main>
      <h1 className=" text-2xl font-bold self-center m-4 ml-8">Maintenance Requests</h1>

      {/* New Request Form */}
      <section className="p-8">
        <h2 className="text-xl font-semibold mb-4">New Request</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
          {/* Room Number */}
          <div>
            <label
              htmlFor="roomNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Room Number
            </label>
            <input
              type="text"
              id="roomNumber"
              value={newRequest.roomNo}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  roomNo: e.target.value,
                  issue: "",
                })
              }
              required
              className="mt-1 block w-24 border border-gray-300 secondaryBg rounded-md shadow-sm p-2"
            />
          </div>

          {/* Amenity Selection */}
          <div>
            <label
              htmlFor="amenity"
              className="block text-sm font-medium text-gray-700"
            >
              Amenity
            </label>
            <select
              id="amenity"
              value={newRequest.amenity}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  amenity: e.target.value,
                  issue: "",
                })
              }
              className="mt-1 block pr-6 border w-[40%] max-sm:w-full secondaryBg border-gray-300 rounded-md  p-2"
              required
            >
              <option value="">Select an amenity</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="carpentry">Carpentry</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Issue Selection (if not 'others') */}
          {newRequest.amenity && newRequest.amenity !== "others" && (
            <div>
              <label
                htmlFor="issue"
                className="block text-sm font-medium text-gray-700"
              >
                Issue
              </label>
              <select
                id="issue"
                value={newRequest.issue}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, issue: e.target.value })
                }
                className="mt-1 block w-[40%] max-sm:w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select an issue</option>
                {issues[newRequest.amenity].map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Other Issue (if 'others' is selected) */}
          {newRequest.amenity === "others" && (
            <div>
              <label
                htmlFor="otherIssue"
                className="block text-sm font-medium text-gray-700"
              >
                Describe the issue
              </label>
              <textarea
                id="otherIssue"
                value={newRequest.otherIssue}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, otherIssue: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="mt-8 bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 self-end"
          >
            Submit Request
          </button>
        </form>
      </section>
      <hr className="mb-4 mx-[10%]" />

      {/* Existing Requests */}
      <section className="sm:p-8 p-4">
        <h1>Existing Requests</h1>
        {/* Not Completed Requests lists */}
        <RequestCategory categoryName={"Not Completed"} />
        {/* Completed */}
        <RequestCategory categoryName={"Completed"} />
      </section>
    </main>
  );
};

export default RequestsManagementPage;
