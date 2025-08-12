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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Problem</h2>
      <form onSubmit={handleSubmit}>
        <select name="category" value={formData.category} onChange={handleChange} className="border p-2 w-full mb-2" required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 w-full mb-2" required />
        <input name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} className="border p-2 w-full mb-2" required />
        <input name="endTime" type="datetime-local" value={formData.endTime} onChange={handleChange} className="border p-2 w-full mb-2" />
        <input name="escalatedPerson" placeholder="Escalated Person" value={formData.escalatedPerson} onChange={handleChange} className="border p-2 w-full mb-2" />
        <textarea name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} className="border p-2 w-full mb-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditProblem;