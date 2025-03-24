import React from "react";
import PropTypes from "prop-types";


// Request form component that can be used in modal or as a standalone form
const RequestForm = ({
    newRequest,
    setNewRequest,
    handleSubmit,
    resetNewRequest,
    isEdit,
    onCancel,
  }) => {
    const appliances = {
      electrical: [
        "fans",
        "sockets",
        "light bulbs",
        "wiring",
        "circuit breakers",
      ],
      plumbing: ["wash hand basin", "shower", "tap", "wc", "leakage"],
      carpentry: [
        "beds",
        "lockers",
        "doors",
        "chairs",
      ],
    };
  
    const specificIssues = {
      electrical: ["not working", "sparking", "loose connection", "flickering"],
      plumbing: ["leaking", "clogged", "broken", "low pressure"],
      carpentry: ["broken", "damaged", "loose", "squeaky"],
    };
  
    const mergeIssue = (appliance, specificIssue) => {
      return `${appliance} - ${specificIssue}`;
    };
  
    return (
      <form onSubmit={handleSubmit} className="flex primaryBg flex-col gap-4">
        {/* Form title */}
        <h2 className="text-xl font-semibold mb-2">
          {isEdit ? "Edit Request" : "New Request"}
        </h2>
  
        {/* Room Number */}
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium  mb-1">
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
              })
            }
            required
            className="block w-24 border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
        {/* Amenity Selection */}
        <div>
          <label htmlFor="amenity" className="block text-sm font-medium  mb-1">
            Select an amenity
          </label>
          <select
            id="amenity"
            value={newRequest.amenity}
            onChange={(e) =>
              setNewRequest({
                ...newRequest,
                amenity: e.target.value,
                appliance: "",
                specificIssue: "",
                issue: "",
              })
            }
            className="block w-full max-w-md border secondaryBg border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">none</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="carpentry">Carpentry</option>
            <option value="others">Others</option>
          </select>
        </div>
  
        {/* Appliance Selection (if not 'others') */}
        {newRequest.amenity && newRequest.amenity !== "others" && (
          <div>
            <label htmlFor="appliance" className="block text-sm font-medium mb-1">
              Appliance
            </label>
            <select
              id="appliance"
              value={newRequest.appliance}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  appliance: e.target.value,
                  issue: mergeIssue(e.target.value, newRequest.specificIssue),
                })
              }
              className="block w-full max-w-md border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an appliance</option>
              {appliances[newRequest.amenity]?.map((appliance) => (
                <option key={appliance} value={appliance}>
                  {appliance}
                </option>
              ))}
            </select>
          </div>
        )}
  
        {/* Specific Issue Selection (if not 'others') */}
        {newRequest.amenity && newRequest.amenity !== "others" && (
          <div>
            <label
              htmlFor="specificIssue"
              className="block text-sm font-medium mb-1"
            >
              Specific Issue
            </label>
            <select
              id="specificIssue"
              value={newRequest.specificIssue}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  specificIssue: e.target.value,
                  issue: mergeIssue(newRequest.appliance, e.target.value),
                })
              }
              className="block w-full max-w-md border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a specific issue</option>
              {specificIssues[newRequest.amenity]?.map((specificIssue) => (
                <option key={specificIssue} value={specificIssue}>
                  {specificIssue}
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
              className="block text-sm font-medium  mb-1"
            >
              Describe the issue
            </label>
            <textarea
              id="otherIssue"
              value={newRequest.otherIssue}
              onChange={(e) =>
                setNewRequest({ ...newRequest, otherIssue: e.target.value })
              }
              className="block w-full border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>
        )}
        {/* Additional description */}
        {newRequest.amenity != "others" && (
          <div>
            <label
              htmlFor="additionalDesc"
              className="block text-sm font-medium mb-1"
            >
              Additional descriptions on the issue{" "}
              <strong>
                {" "}
                <i className="text-nowrap">( if any )</i>
              </strong>
            </label>
            <textarea
              id="additionalDesc"
              value={newRequest.desc}
              onChange={(e) =>
                setNewRequest({ ...newRequest, desc: e.target.value })
              }
              className="block w-full border secondaryBg border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="fill here..."
            />
          </div>
        )}
  
        {/* Form buttons */}
        <div className="flex justify-end gap-3 mt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEdit ? "Update Request" : "Submit Request"}
          </button>
        </div>
      </form>
    );
  };

export default RequestForm;