import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = [
  "Core Switch", "WAN Firewalls", "Perimeter Firewalls", "SAP Tunnels", "Access Switches",
  "Access Points", "Virtual Machines - VCenter", "Backup Servers - Avamar",
  "Critical Server Room Alerts", "IDRAC Alerts", "Dialog", "SLT", "Citrix"
];

const AddProblem = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    startTime: '',
    endTime: '',
    escalatedPerson: '',
    remarks: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined
      };
      await axios.post('http://localhost:5000/api/problems', dataToSend);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add problem");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Problem</h2>
      <form onSubmit={handleSubmit}>
        <select name="category" value={formData.category} onChange={handleChange} className="border p-2 w-full mb-2" required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 w-full mb-2" required />
        <label className="block mb-1 font-semibold">Start Date & Time</label>
        <input
          name="startTime"
          type="datetime-local"
          value={formData.startTime}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <label className="block mb-1 font-semibold">End Date & Time</label>
        <input
          name="endTime"
          type="datetime-local"
          value={formData.endTime}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input name="escalatedPerson" placeholder="Escalated Person" value={formData.escalatedPerson} onChange={handleChange} className="border p-2 w-full mb-2" />
        <textarea name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} className="border p-2 w-full mb-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </form>
    </div>
  );
};

export default AddProblem;