import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const categories = [
  "Core Switch", "WAN Firewalls", "Perimeter Firewalls", "SAP Tunnels", "Access Switches",
  "Access Points", "Virtual Machines - VCenter", "Backup Servers - Avamar",
  "Critical Server Room Alerts", "IDRAC Alerts", "Dialog", "SLT", "Citrix"
];

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/problems');
      setProblems(res.data);
      setFilteredProblems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let filtered = problems;
    if (search) filtered = filtered.filter(p => p.description.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter) filtered = filtered.filter(p => p.category === categoryFilter);
    if (statusFilter === 'Open') filtered = filtered.filter(p => !p.endTime);
    if (statusFilter === 'Closed') filtered = filtered.filter(p => p.endTime);
    setFilteredProblems(filtered);
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, problems]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/problems/${id}`);
      fetchProblems();
    } catch (err) {
      console.error(err);
    }
  };

  const paginatedProblems = filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23E0F2FA%22 fill-opacity=%220.3%22 d=%22M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z%22/%3E%3C/svg%3E')]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-2xl mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide">Problem Library Dashboard</h1>
          <Link
            to="/add"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
          >
            Add Problem
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search by description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300"
            />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full md:w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="p-2">
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full md:w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6">
          {paginatedProblems.map(problem => (
            <div
              key={problem._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Category: {problem.category}</h3>
              <p className="text-gray-600 mb-1">Description: {problem.description}</p>
              <p className="text-gray-600 mb-1">Start Time: {new Date(problem.startTime).toLocaleString()}</p>
              <p className="text-gray-600 mb-1">End Time: {problem.endTime ? new Date(problem.endTime).toLocaleString() : 'Ongoing'}</p>
              <p className="text-gray-600 mb-1">Escalated To: {problem.escalatedPerson || 'N/A'}</p>
              <p className="text-gray-600 mb-1">Remarks: {problem.remarks || 'N/A'}</p>
              <div className="flex justify-end mt-4 space-x-3">
                <Link
                  to={`/edit/${problem._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} font-medium transition duration-300 transform hover:scale-105`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;