import React, { useContext, useEffect, useState } from "react";
import { fetchLogs } from "../../services/logs";
import { NotificationContext } from "../../Components/Notification";
import * as jsondiffpatch from "jsondiffpatch";

const LogDetailsModal = ({ log, onClose }) => {
  if (!log) return null;

  // Get the delta (differences)
  const delta = jsondiffpatch.diff(log.prevState, log.currState);

  // Custom function to extract differences
  function extractDifferences(delta, path = "") {
    if (!delta) return [];

    const differences = [];

    for (const key in delta) {
      const currentPath = path ? `${path}.${key}` : key;
      const change = delta[key];

      // Changed value (array with 2 elements)
      if (
        Array.isArray(change) &&
        change.length === 2 &&
        typeof change[2] === "undefined"
      ) {
        differences.push({
          path: currentPath,
          oldValue: change[0],
          newValue: change[1],
          type: "modified",
        });
      }
      // Nested object
      else if (typeof change === "object" && !Array.isArray(change)) {
        differences.push(...extractDifferences(change, currentPath));
      }
    }

    return differences;
  }

  // Extract the differences
  const differences = extractDifferences(delta);
  console.log("Differences:", differences);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="primaryBg rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">Log Details</h2>

        {/* Basic Log Info */}
        <div className="space-y-2 mb-6">
          <div>
            <strong>Timestamp:</strong>{" "}
            {new Date(log.timestamp).toLocaleString()}
          </div>
          <div>
            <strong>Admin Name:</strong> {log.adminName}
          </div>
          <div>
            <strong>Action:</strong> {log.action}
          </div>
          <div>
            <strong>Section:</strong> {log.section}
          </div>
        </div>

        {/* Differences */}
        <div className="mb-4">
          <h3 className="font-semibold">Changes</h3>
          {differences.length === 0 ? (
            <p className="text-gray-500">No changes detected</p>
          ) : (
            <ul className="space-y-2 mt-2">
              {differences.map((diff, index) => (
                <li key={index} className="p-2 border border-gray-200 rounded">
                  <div className="font-medium">{diff.path}</div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-red-50 p-2 rounded">
                      <span className="text-xs text-red-600">Previous:</span>
                      <div className="mt-1">
                        {JSON.stringify(diff.oldValue)}
                      </div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <span className="text-xs text-green-600">Current:</span>
                      <div className="mt-1">
                        {JSON.stringify(diff.newValue)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Side-by-Side Comparison */}
        <div className="flex gap-6 overflow-y-auto flex-1 flex-wrap">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Previous State</h3>
            <pre className="secondaryBg p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(log.prevState, null, 2)}
            </pre>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Current State</h3>
            <pre className="secondaryBg p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(log.currState, null, 2)}
            </pre>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 self-end"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    section: "",
    adminName: "",
    startDate: "",
    endDate: "",
  });

  console.log(selectedLog);
  const { setNotification, showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const getLogs = async () => {
      try {
        // setLoading(true);
        // setError(null);

        showNotification("Loading logs...", "warning");

        // Call the fetchLogs function with the current filters
        const logsData = await fetchLogs(filters);
        setLogs(logsData);
        showNotification("Load Successful", "success");
      } catch (err) {
        console.error("Error fetching logs:", err);
        showNotification(
          "Failed to load logs. Please Check your connection",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, [filters]);

  console.log(logs);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // if (loading) return <div className="p-4">Loading logs...</div>;
  // if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 ml-3">Admin Logs</h1>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <select
            name="section"
            value={filters.section}
            onChange={handleFilterChange}
            className="p-2 border rounded secondaryBg h-fit"
          >
            <option value="">All Sections</option>
            <option value="Student Info">Student Info</option>
            <option value="Maintenance Requests">Maintenance Requests</option>
            <option value="Announcements">Announcements</option>
          </select>

          <input
            type="text"
            name="adminName"
            placeholder="Filter by Admin Name"
            value={filters.adminName}
            onChange={handleFilterChange}
            className="p-2 border rounded secondaryBg h-fit"
          />

          <label className="flex flex-col">
            Start Date
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="p-2 border rounded secondaryBg h-fit"
            />
          </label>
          <label className="flex flex-col">
            End Date
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="p-2 border rounded secondaryBg h-fit"
            />
          </label>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="secondaryBg">
              <th className="p-2 px-4 border text-left">Timestamp</th>
              <th className="p-2 border text-left text-nowrap">Admin Name</th>
              <th className="p-2 border text-left">Action</th>
              {/* <th className="p-2 border text-left">Details</th> */}
              <th className="p-2 px-4 border text-left">Section</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="p-2 border">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-2 border">{log.adminName}</td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">{log.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <LogDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </main>
  );
};

export default LogsPage;
