import React, { useState, useEffect } from 'react';
import { getDocumentCountsByType, getDocumentCountsByState } from '../../services/documentService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [countsByType, setCountsByType] = useState({});
  const [countsByState, setCountsByState] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const typeCounts = await getDocumentCountsByType();
      const stateCounts = await getDocumentCountsByState();
      setCountsByType(typeCounts);
      setCountsByState(stateCounts);
      setLoading(false);
    };

    fetchCounts();
  }, []); // Fetch counts on component mount

  // Transform data for Recharts
  const typeChartData = Object.entries(countsByType).map(([type, count]) => ({ name: type, value: count }));
  const stateChartData = Object.entries(countsByState).map(([state, count]) => ({ name: state, value: count }));

  // Define some colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666', '#66B2FF', '#FFD700', '#ADFF2F', '#FF69B4'];

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Procurement Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart by Type */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Documents by Type</h3>
          {typeChartData.length === 0 ? (
            <p className="text-gray-600">No data available for document types.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart by State */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Documents by State</h3>
           {stateChartData.length === 0 ? (
            <p className="text-gray-600">No data available for document states.</p>
          ) : (
             <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie
                   data={stateChartData}
                   cx="50%"
                   cy="50%"
                   outerRadius={100}
                   fill="#8884d8"
                   dataKey="value"
                   label
                 >
                   {stateChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Placeholder for other insights */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
         <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Insights</h3>
         <p className="text-gray-600">[Placeholder for additional dashboard insights and metrics]</p>
      </div>

    </div>
  );
};

export default Dashboard; 