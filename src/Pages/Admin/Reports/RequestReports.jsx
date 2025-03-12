import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Card, CardHeader, CardBody, CardTitle, Button, FormGroup, Label, Input } from 'reactstrap'; // Reactstrap components
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllRequests } from '../../../services/requests'; // Import the service to fetch requests
import { ArrowBigLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MaintenanceReport = () => {
  const [reportData, setReportData] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    requestsByType: [],
    requestsByRoom: [],
    requestTrends: [] // Last 6 months
  });
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        // Fetch all requests from the service
        const requestsData = await getAllRequests();

        // Filter requests based on the selected date range
        const now = new Date();
        let startDate = new Date();

        if (dateRange === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (dateRange === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        } else if (dateRange === 'year') {
          startDate.setFullYear(now.getFullYear() - 1);
        }

        const filteredRequests = requestsData.filter(req => {
          const reqDate = new Date(req.createdAt);
          return reqDate >= startDate;
        });

        // Count by status
        const totalRequests = filteredRequests.length;
        const pendingRequests = filteredRequests.filter(req => req.status === 'Pending').length;
        const inProgressRequests = filteredRequests.filter(req => req.status === 'Reviewed').length;
        const completedRequests = filteredRequests.filter(req => req.status === 'Completed').length;

        // Group by type
        const types = [...new Set(filteredRequests.map(req => req.type))];
        const requestsByType = types.map(type => {
          const count = filteredRequests.filter(req => req.type === type).length;
          return { name: type, value: count };
        });

        // Group by Room
        const rooms = [...new Set(filteredRequests.map(req => req.roomNo))];
        const requestsByRoom = rooms.map(room => {
          const total = filteredRequests.filter(req => req.roomNo === room).length;
          const pending = filteredRequests.filter(req => req.roomNo === room && req.status === 'Pending').length;
          const inProgress = filteredRequests.filter(req => req.roomNo === room && req.status === 'Reviewed').length;
          const completed = filteredRequests.filter(req => req.roomNo === room && req.status === 'Completed').length;

          return {
            name: room,
            pending,
            'in-progress': inProgress,
            completed
          };
        });

        // Calculate monthly trends for the past 6 months
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const monthDate = new Date();
          monthDate.setMonth(now.getMonth() - i);
          const monthName = monthDate.toLocaleString('default', { month: 'short' });
          const year = monthDate.getFullYear();
          const monthStart = new Date(year, monthDate.getMonth(), 1);
          const monthEnd = new Date(year, monthDate.getMonth() + 1, 0);

          const monthRequests = filteredRequests.filter(req => {
            const reqDate = new Date(req.createdAt);
            return reqDate >= monthStart && reqDate <= monthEnd;
          });

          last6Months.push({
            name: `${monthName} ${year}`,
            requests: monthRequests.length
          });
        }

        setReportData({
          totalRequests,
          pendingRequests,
          inProgressRequests,
          completedRequests,
          requestsByType,
          requestsByRoom,
          requestTrends: last6Months
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching maintenance data:", err);
        setError("Failed to load maintenance data. Please try again later.");
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [dateRange]);

  const exportToPDF = () => {
    alert("PDF export functionality would be implemented here");
  };

  const exportToExcel = () => {
    alert("Excel export functionality would be implemented here");
  };

  if (loading) return <div className="p-4">Loading maintenance data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className='p-4 md:p-8 primaryBg'>
        
        <Link to={'/admin-requests'} className="my-3 font-semibold flex underline">
          <ArrowBigLeft/>
          back</Link>
    <Card className="w-full max-w-6xl mx-auto my-4">
      <CardHeader>
        <CardTitle tag="h1" className='mb-4 ml-2'>Maintenance Request Report</CardTitle>
        <hr className='m-4'/>
        <div className="flex gap-4 my-3">
          <FormGroup>
            <Input
              type="select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 pr-4  rounded secondaryBg"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </Input>
          </FormGroup>
          <div className="flex gap-2">
            <Button color="primary" className='underline underline-offset-2 p-2' onClick={exportToPDF}>
              Export to PDF
            </Button>
            <Button color="success" className='underline underline-offset-2 p-2' onClick={exportToExcel}>
              Export to Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-300 p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-900">Total Requests</h3>
            <p className="text-2xl text-blue-900">{reportData.totalRequests}</p>
          </div>
          <div className="bg-yellow-300 p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-900">Pending</h3>
            <p className="text-2xl text-blue-900">{reportData.pendingRequests}</p>
          </div>
          <div className="bg-orange-300 p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-900">In Progress</h3>
            <p className="text-2xl text-blue-900">{reportData.inProgressRequests}</p>
          </div>
          <div className="bg-green-300 p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-900">Completed</h3>
            <p className="text-2xl text-blue-900">{reportData.completedRequests}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Request Types Pie Chart */}
          <div className="primaryBg p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Requests by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.requestsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.requestsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend Chart */}
          <div className="primaryBg p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Request Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={reportData.requestTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip/>
                <Legend />
                <Bar dataKey="requests" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests by Room */}
        <div className="primaryBg p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Requests by Room</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={reportData.requestsByRoom}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" stackId="a" fill="#FFBB28" />
              <Bar dataKey="in-progress" stackId="a" fill="#FF8042" />
              <Bar dataKey="completed" stackId="a" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Table View */}
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Request Details by Room</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="tertiaryBg ">
                <th className="p-2 border tertiaryTxt text-left">Room Number</th>
                <th className="p-2 border tertiaryTxt text-center">Pending</th>
                <th className="p-2 border tertiaryTxt text-center">In Progress</th>
                <th className="p-2 border tertiaryTxt text-center">Completed</th>
                <th className="p-2 border tertiaryTxt text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.requestsByRoom.map((hall, index) => (
                <tr key={index} className={index % 2 === 0 ? 'primaryBg' : 'secondaryBg'}>
                  <td className="p-2 border ">{hall.name}</td>
                  <td className="p-2 border text-center">{hall.pending}</td>
                  <td className="p-2 border text-center">{hall['in-progress']}</td>
                  <td className="p-2 border text-center">{hall.completed}</td>
                  <td className="p-2 border text-center font-semibold">
                    {hall.pending + hall['in-progress'] + hall.completed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
    </main>
  );
};

export default MaintenanceReport;