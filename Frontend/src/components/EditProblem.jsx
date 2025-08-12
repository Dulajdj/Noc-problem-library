import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const categories = [
  "Core Switch", "WAN Firewalls", "Perimeter Firewalls", "SAP Tunnels", "Access Switches",
  "Access Points", "Virtual Machines - VCenter", "Backup Servers - Avamar",
  "Critical Server Room Alerts", "IDRAC Alerts", "Dialog", "SLT", "Citrix"
];

const EditProblem = () => {
  const [formData, setFormData] = useState({
    category: '', description: '', startTime: '', endTime: '', escalatedPerson: '', remarks: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
      setFormData({
        ...res.data,
        startTime: res.data.startTime ? new Date(res.data.startTime).toISOString().slice(0, 16) : '',
        endTime: res.data.endTime ? new Date(res.data.endTime).toISOString().slice(0, 16) : ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Remove _id and __v before sending
    const { _id, __v, ...dataToSend } = formData;
    try {
      await axios.put(`http://localhost:5000/api/problems/${id}`, dataToSend);
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '28rem',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: '#1f2937',
        textAlign: 'center'
      }}>Edit Problem</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{
            padding: '0.5rem',
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            backgroundColor: '#ffffff',
            appearance: 'none',
            color: '#4b5563',
            transition: 'border-color 0.3s, box-shadow 0.3s'
          }}
          required
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
        >
          <option value="" style={{ color: '#9ca3af' }}>Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat} style={{ padding: '0.5rem', color: '#1f2937' }}>
              {cat}
            </option>
          ))}
        </select>
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={{
            padding: '0.5rem',
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            color: '#4b5563'
          }}
          required
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
        />
        <input
          name="startTime"
          type="datetime-local"
          value={formData.startTime}
          onChange={handleChange}
          style={{
            padding: '0.5rem',
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            color: '#4b5563'
          }}
          required
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
        />
        <input
          name="endTime"
          type="datetime-local"
          value={formData.endTime}
          onChange={handleChange}
          style={{
            padding: '0.5rem',
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            color: '#4b5563'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
        />
        <input
          name="escalatedPerson"
          placeholder="Escalated Person"
          value={formData.escalatedPerson}
          onChange={handleChange}
          style={{
            padding: '0.5rem',
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            color: '#4b5563'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
        />
        <textarea
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          style={{
            padding: '0.5rem',
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            color: '#4b5563',
            resize: 'vertical',
            minHeight: '4rem'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, transform 0.3s'
          }}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#2563eb'; e.target.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = '#3b82f6'; e.target.style.transform = 'scale(1)'; }}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProblem;