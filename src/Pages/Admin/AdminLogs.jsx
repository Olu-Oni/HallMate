import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../config/firebase";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    section: "",
    adminName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let logsQuery = query(collection(db, "AdminLogs"), orderBy("timestamp", "desc"));

        // Apply filters
        if (filters.section) {
          logsQuery = query(logsQuery, where("section", "==", filters.section));
        }
        if (filters.adminName) {
          logsQuery = query(logsQuery, where("adminName", "==", filters.adminName));
        }
        if (filters.startDate && filters.endDate) {
          logsQuery = query(
            logsQuery,
            where("timestamp", ">=", filters.startDate),
            where("timestamp", "<=", filters.endDate)
          );
        }

        const logsSnapshot = await getDocs(logsQuery);
        const logsData = logsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to load logs. Please try again later.");
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (loading) return <div className="p-4">Loading logs...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 ml-3">Admin Logs</h1>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <select
            name="section"
            value={filters.section}
            onChange={handleFilterChange}
            className="p-2 border rounded"
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
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 px-4 border text-left">Timestamp</th>
              <th className="p-2 border text-left text-nowrap">Admin Name</th>
              <th className="p-2 border text-left">Action</th>
              <th className="p-2 border text-left">Details</th>
              <th className="p-2 px-4 border text-left">Section</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-2 border">{log.adminName}</td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">{log.details}</td>
                <td className="p-2 border">{log.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default LogsPage;