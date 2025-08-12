// Updated Dashboard.jsx
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
  const [dashboardData, setDashboardData] = useState({ totalProblems: 0, latestProblem: null, addedProblems: 0 });
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
    const total = problems.length;
    const sortedProblems = [...problems].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    const latest = sortedProblems[0] || null;
    const today = new Date();
    const addedToday = problems.filter(p => {
      const start = new Date(p.startTime);
      return start.getFullYear() === today.getFullYear() &&
             start.getMonth() === today.getMonth() &&
             start.getDate() === today.getDate();
    }).length;
    setDashboardData({ totalProblems: total, latestProblem: latest, addedProblems: addedToday });
  }, [problems]);

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

  const calculateDuration = (start, end) => {
    if (!end) return 'Ongoing';
    const duration = Math.floor((new Date(end) - new Date(start)) / (1000 * 60));
    return duration + ' minutes';
  };

  const paginatedProblems = filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #eef2f7 0%, #ffffff 100%)',
      backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23E0F2FA%22 fill-opacity=%220.3%22 d=%22M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z%22/%3E%3C/svg%3E')",
      padding: '1.5rem'
    }}>
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{
          background: 'linear-gradient(to right, #2563eb 0%, #3b82f6 100%)',
          color: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '0.1em' }}>Problem Library Dashboard</h1>
          <Link
            to="/add"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s, background-color 0.3s',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#059669'; e.target.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#10b981'; e.target.style.transform = 'scale(1)'; }}
          >
            Add Problem
          </Link>
        </div>

        {/* Dashboard Summary Section */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>Dashboard Summary</h2>
          <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
            Total Problems: <span style={{ fontWeight: '600', color: '#3b82f6' }}>{dashboardData.totalProblems}</span>
          </p>
          <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
            Added Problems Today: <span style={{ fontWeight: '600', color: '#3b82f6' }}>{dashboardData.addedProblems}</span>
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '16rem',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                color: '#4b5563'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '16rem',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                color: '#4b5563'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '16rem',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                color: '#4b5563'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {paginatedProblems.map(problem => (
            <div
              key={problem._id}
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #3b82f6',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseOver={(e) => { e.target.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)'; e.target.style.transform = 'translateY(-0.5rem)'; }}
              onMouseOut={(e) => { e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; e.target.style.transform = 'translateY(0)'; }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Category: {problem.category}</h3>
              {problem.subCategory && <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Subcategory: {problem.subCategory}</p>}
              {problem.subSubCategory && <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Sub-Subcategory: {problem.subSubCategory}</p>}
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Description: {problem.description}</p>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Start Time: {new Date(problem.startTime).toLocaleString()}</p>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>End Time: {problem.endTime ? new Date(problem.endTime).toLocaleString() : 'Ongoing'}</p>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Duration: {calculateDuration(problem.startTime, problem.endTime)}</p>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Escalated To: {problem.escalatedPerson || 'N/A'}</p>
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Remarks: {problem.remarks || 'N/A'}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.75rem' }}>
                <Link
                  to={`/edit/${problem._id}`}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#2563eb'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#3b82f6'; }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(problem._id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#dc2626'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#ef4444'; }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: '0 0.25rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: currentPage === i + 1 ? '#3b82f6' : '#e5e7eb',
                color: currentPage === i + 1 ? '#ffffff' : '#4b5563',
                fontWeight: '500',
                transition: 'background-color 0.3s, transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { if (currentPage !== i + 1) e.target.style.backgroundColor = '#d1d5db'; e.target.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { if (currentPage !== i + 1) e.target.style.backgroundColor = '#e5e7eb'; e.target.style.transform = 'scale(1)'; }}
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