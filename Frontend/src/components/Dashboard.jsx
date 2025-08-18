import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const categories = [
  "Core Switch", "WAN Firewalls", "Perimeter Firewalls", "SAP Tunnels", "Access Switches",
  "Access Points", "Virtual Machines - VCenter", "Backup Servers - Avamar",
  "Critical Alerts", "Server Room Alerts", "IDRAC Alerts", "Dialog", "SLT", "Citrix"
];

const Modal = ({ isOpen, onClose, onConfirm, message, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '28rem',
        width: '90%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        textAlign: 'center',
        transform: isOpen ? 'scale(1)' : 'scale(0.95)',
        opacity: isOpen ? 1 : 0,
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: isSuccess ? '#10b981' : '#2c3e50',
          marginBottom: '1rem'
        }}>{isSuccess ? 'Success' : 'Confirm Deletion'}</h3>
        <p style={{
          color: '#4b5563',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.5'
        }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {isSuccess ? (
            <button
              onClick={onClose}
              style={{
                background: '#3498db',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2980b9';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3498db';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              OK
            </button>
          ) : (
            <>
              <button
                onClick={onConfirm}
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#c0392b';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e74c3c';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                Delete
              </button>
              <button
                onClick={onClose}
                style={{
                  background: '#6b7280',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#4b5563';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#6b7280';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardData, setDashboardData] = useState({ totalProblems: 0, addedProblems: 0 });
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    isSuccess: false,
    onConfirm: null
  });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/problems');
      console.log("Fetched problems data:", res.data);
      setProblems(res.data);
      setFilteredProblems(res.data);
    } catch (err) {
      console.error("Error fetching problems:", err);
    }
  };

  useEffect(() => {
    const total = problems.length;
    const today = new Date();
    const addedToday = problems.filter(p => {
      const start = new Date(p.startTime);
      return start.getFullYear() === today.getFullYear() &&
             start.getMonth() === today.getMonth() &&
             start.getDate() === today.getDate();
    }).length;
    setDashboardData({ totalProblems: total, addedProblems: addedToday });
  }, [problems]);

  useEffect(() => {
    let filtered = problems;
    if (search) {
      filtered = filtered.filter(p => p.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (statusFilter === 'Open') {
      filtered = filtered.filter(p => !p.endTime);
    }
    if (statusFilter === 'Closed') {
      filtered = filtered.filter(p => p.endTime);
    }
    if (startDateFilter) {
      filtered = filtered.filter(p => {
        const start = new Date(p.startTime);
        return start >= new Date(startDateFilter);
      });
    }
    if (endDateFilter) {
      filtered = filtered.filter(p => {
        const start = new Date(p.startTime);
        return start <= new Date(endDateFilter);
      });
    }
    setFilteredProblems(filtered);
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, startDateFilter, endDateFilter, problems]);

  const handleDelete = (id) => {
    setModalState({
      isOpen: true,
      message: 'Are you sure you want to delete this problem?',
      isSuccess: false,
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/problems/${id}`);
          await fetchProblems();
          setModalState({
            isOpen: true,
            message: 'Problem deleted successfully!',
            isSuccess: true,
            onConfirm: null
          });
        } catch (err) {
          console.error("Error deleting problem:", err);
          setModalState({
            isOpen: true,
            message: 'Failed to delete problem. Please try again.',
            isSuccess: true, // Using success modal for error to keep UI consistent
            onConfirm: null
          });
        }
      }
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, message: '', isSuccess: false, onConfirm: null });
  };

  const handleResetFilters = () => {
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    if (!end) return 'Ongoing';
    const duration = Math.floor((new Date(end) - new Date(start)) / (1000 * 60));
    return duration + ' minutes';
  };

  const downloadExcel = () => {
    const data = filteredProblems.map(problem => ({
      Category: problem.category || 'N/A',
      SubCategory: problem.subCategory || 'N/A',
      SubSubCategory: problem.subSubCategory || 'N/A',
      Description: problem.description || 'N/A',
      'Start Time': problem.startTime ? new Date(problem.startTime).toLocaleString() : 'N/A',
      'End Time': problem.endTime ? new Date(problem.endTime).toLocaleString() : 'Ongoing',
      Duration: calculateDuration(problem.startTime, problem.endTime),
      'Escalated Person': problem.escalatedPerson || 'N/A',
      Remarks: problem.remarks || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Problems');
    
    const colWidths = [
      { wch: 20 }, // Category
      { wch: 20 }, // SubCategory
      { wch: 30 }, // SubSubCategory
      { wch: 50 }, // Description
      { wch: 25 }, // Start Time
      { wch: 25 }, // End Time
      { wch: 15 }, // Duration
      { wch: 20 }, // Escalated Person
      { wch: 50 }  // Remarks
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, 'problems_export.xlsx');
  };

  const paginatedProblems = filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc, #cfdef3)', padding: '1.5rem', fontFamily: 'Georgia, serif', display: 'flex', gap: '1.5rem' }}>
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        message={modalState.message}
        isSuccess={modalState.isSuccess}
      />
      <div style={{ flex: '1', maxWidth: '14rem', background: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <img src="/Fentons IT Logo.png" alt="Fentons IT Logo" style={{ width: '100%', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2c3e50', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Summary</h2>
          <p style={{ color: '#7f8c8d', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Total Issues: <span style={{ color: '#3498db', fontWeight: '600' }}>{dashboardData.totalProblems}</span></p>
          <p style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>Today’s Issues: <span style={{ color: '#3498db', fontWeight: '600' }}>{dashboardData.addedProblems}</span></p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '0.375rem', fontSize: '0.9rem', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '0.375rem', fontSize: '0.9rem', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '0.375rem', fontSize: '0.9rem', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          <label style={{ display: 'block', color: '#2c3e50', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Start Date</label>
          <input
            type="datetime-local"
            value={startDateFilter}
            onChange={e => setStartDateFilter(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '0.375rem', fontSize: '0.9rem', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <label style={{ display: 'block', color: '#2c3e50', fontSize: '0.9rem', marginBottom: '0.25rem' }}>End Date</label>
          <input
            type="datetime-local"
            value={endDateFilter}
            onChange={e => setEndDateFilter(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '0.375rem', fontSize: '0.9rem', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <button
            onClick={handleResetFilters}
            style={{
              background: '#6b7280',
              color: '#fff',
              padding: '0.6rem',
              border: 'none',
              borderRadius: '0.375rem',
              width: '100%',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              transition: 'background-color 0.3s, transform 0.3s'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#4b5563'; e.target.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#6b7280'; e.target.style.transform = 'scale(1)'; }}
          >
            Reset Date Filters
          </button>
        </div>
      </div>
      <div style={{ flex: '3', background: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2c3e50' }}>NOC Problem Library Dashboard</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={downloadExcel}
              style={{
                background: '#10b981',
                color: '#fff',
                padding: '0.7rem 1.2rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'background-color 0.3s, transform 0.3s'
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#059669'; e.target.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = '#10b981'; e.target.style.transform = 'scale(1)'; }}
            >
              Download as Excel
            </button>
            <Link
              to="/add"
              style={{
                background: '#3498db',
                color: '#fff',
                padding: '0.7rem 1.2rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'background-color 0.3s, transform 0.3s'
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#2980b9'; e.target.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = '#3498db'; e.target.style.transform = 'scale(1)'; }}
            >
              Add Problem
            </Link>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          {paginatedProblems.map(problem => (
            <div key={problem._id} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.375rem', borderLeft: '4px solid #3498db', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.3rem' }}>Category: {problem.category || 'N/A'}</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '0.2rem' }}>Host: {problem.description || 'N/A'}</p>
              <p style={{ color: '#7f8c8d', marginBottom: '0.2rem' }}>Start Time: {problem.startTime ? new Date(problem.startTime).toLocaleString() : 'N/A'}</p>
              <p style={{ color: '#7f8c8d', marginBottom: '0.2rem' }}>End Time: {problem.endTime ? new Date(problem.endTime).toLocaleString() : 'Ongoing'}</p>
              <p style={{ color: '#7f8c8d', marginBottom: '0.2rem' }}>Duration: {calculateDuration(problem.startTime, problem.endTime)}</p>
              <p style={{ color: '#7f8c8d', marginBottom: '0.2rem' }}>Escalated Person: {problem.escalatedPerson || 'N/A'}</p>
              <p style={{ color: '#7f8c8d', marginBottom: '0.2rem' }}>Remarks: {problem.remarks || 'N/A'}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <Link to={`/edit/${problem._id}`} style={{ background: '#3498db', color: '#fff', padding: '0.4rem 0.9rem', borderRadius: '0.25rem', textDecoration: 'none', transition: 'background-color 0.3s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}>Edit</Link>
                <button onClick={() => handleDelete(problem._id)} style={{ background: '#e74c3c', color: '#fff', padding: '0.4rem 0.9rem', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', transition: 'background-color 0.3s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.3rem' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                background: currentPage === i + 1 ? '#3498db' : '#fff',
                color: currentPage === i + 1 ? '#fff' : '#2c3e50',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s, transform 0.2s'
              }}
              onMouseOver={(e) => { if (currentPage !== i + 1) e.target.style.backgroundColor = '#ecf0f1'; e.target.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { if (currentPage !== i + 1) e.target.style.backgroundColor = '#fff'; e.target.style.transform = 'scale(1)'; }}
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