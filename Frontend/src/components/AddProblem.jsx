// Updated AddProblem.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = [
  "Core Switch", "WAN Firewalls", "Perimeter Firewalls", "SAP Tunnels", "Access Switches",
  "Access Points", "Virtual Machines - VCenter", "Backup Servers - Avamar",
  "Critical Alerts","Server Room Alerts", "IDRAC Alerts", "Dialog", "SLT", "Citrix"
];

const wanFirewallSubCategories = [
  "Advantis", "Agro", "Fabric", "Haycarb", "Fiber", "Leisure", "Martin Bauer",
  "DPL", "Alumex", "Aventura", "SAT", "Mabroc Tea"
];

const accessPointSubCategories = [
  "Group_IT", "Advantis", "Haycarb", "Consumer", "Agro", "Leisure", "KVPL", "HPL", "Aventura",
  "Martin Bauer", "TTEL", "CPMD", "DPL", "Fibre"
];

const wanSubSubCategories = {
  "Advantis": [
    "ADV-3PL-Kelaniya", "ADV-3PL-Kotugoda", "ADV-Expelogixs",
    "ADV-Hayleys Free Zone 1- Venus", "ADV-Hayleys Free Zone 2- Mecury",
    "ADV-Logiwiz Kelanimulla"
  ],
  "Agro": [
    "Agro-Quality Seeds Borlanda 2", "Agro-CocoLife Pannala", "Agro-Technica Ekala",
    "Agro-HJS", "Agro-Biotech Nanuoya", "Agro-Seeduwa", "Agro-Haychem Kottawa",
    "Agro-Animal Health Sapugaskanda", "Agro-Pannipitiya", "Agro-QS_Hokandara",
    "Agro-Fertilizer", "Agro-Quality Seeds Borlanda 1"
  ],
  "Fabric": [
    "Fabric Neboda", "Fabric Wagawaththa"
  ],
  "Haycarb": [
    "Haycarb-Badalgama", "Haycarb-Madampe", "Haycarb-Weewalduwa"
  ],
  "Fiber": [
    "Fiber-Chas.P Galle", "Fiber-Chas.P Padampe", "Fiber-Chas.P Naththandiya",
    "Fiber-Creative Polymat", "Fiber-Kuliyapitiya", "Fiber-Ravi Industries",
    "Fiber-Rileys Katana", "Fiber-Volana Kotugoda"
  ],
  "Leisure": [
    "Amaya Kandyan Resort", "Amaya Kingsbury", "Amaya Lake Dambulla",
    "Amaya Leisure WTC", "Amaya Sunset Beach"
  ],
  "Martin Bauer": [],
  "DPL": [
    "DPL-Premier Gloves Biyagama", "DPL-Sport Gloves Biyagama",
    "DPL-Uni Gloves Biyagama", "DPL-Hanwella", "DPL-Kottawa"
  ],
  "Alumex": [
    "Alumex Gonawala", "Alumex Ho Makola", "Alumex Prime"
  ],
  "Aventura": [],
  "SAT": [],
  "Mabroc Tea": [
    "Mabroc-Tea"
  ]
};

const accessPointSubSubCategories = {
  "Group_IT": [
    "AP_01-GRIT-01-30",
    "AP_109-HBS1-162",
    "AP_03-TREASURY-01-122",
    "AP_26-TREASURY_BR-123",
    "AP_34-HAY_SEC_02-20",
    "AP_35-HAY_FIN_01-21",
    "AP_13-LEGAL-01-72",
    "AP_40-GFM-01-140",
    "AP_08-GHR_01-78",
    "AP_32-CONFERENCE_01-10",
    "AP_16-ADV_AST_GLOBAL_01-121"
  ],
  "Advantis": [
    "AP_07-ADV_HO-04-119",
    "AP_37-ADV_HO-02-117",
    "AP_39-ADV_HO-03-118",
    "AP_28-ADV_CLSH_01-112",
    "AP_43-ADV_CLSH_02-116",
    "AP_21-ADV_CLSH_02-123",
    "AP_29-ADV_NYK_01-113",
    "AP_33-ADV_AVTN_01-115",
    "AP_30-ADV_VSTR_01-114"
  ],
  "Haycarb": [
    "AP_88-HAYCARB_05-76",
    "AP_49-HAYCARB_04-75",
    "AP_11-HAYCARB_01-70",
    "AP_108-HAYCARB_06-77",
    "AP_12-HAYCARB_02-71",
    "AP_42-HAYCARB_03-74",
    "AP_18-PURITAS_01-90"
  ],
  "Aventura": [
    "AP_23-AVENTURA_02-51",
    "AP_19-AVENTURA_01-50",
    "AP_20-AVENTURA_03-53"
  ],
  "HPL": [
    "AP_123-HPL_01-181"
  ],
  "KVPL": [
    "AP_27-KVPL_01-65"
  ],
  "Leisure": [
    "AP_24-LIFE_SCIENCES_01-52"
  ],
  "Agro": [
    "AP_90-AGRO_05-64",
    "AP_89-AGRO_04-63",
    "AP_04-AGRO_01-67"
  ],
  "Consumer": [
    "AP_05-CONSUMER_01-40"
  ],
  "TTEL": [
    "AP_22-TTEL_01-245"
  ],
  "CPMD": [
    "AP_38-CPMD_01-55"
  ],
  "Martin Bauer": [
    "AP_31-HGBL_01-26"
  ],
  "Fibre": [
    "AP_15-FIBRE_01-120"
  ],
  "DPL": [
    "AP_25-DPL_01-155",
    "AP_06-DPL_02-156"
  ]
};

const AddProblem = () => {
  const [formData, setFormData] = useState({
    category: '',
    customCategory: '',
    subCategory: '',
    customSubCategory: '',
    subSubCategory: '',
    customSubSubCategory: '',
    description: '',
    startTime: '',
    endTime: '',
    escalatedPerson: '',
    remarks: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
        ...(name === 'category' && value !== 'Other' && { customCategory: '' }),
        ...(name === 'category' && { subCategory: '', customSubCategory: '', subSubCategory: '', customSubSubCategory: '', description: '' }),
        ...(name === 'subCategory' && value !== 'Other' && { customSubCategory: '' }),
        ...(name === 'subCategory' && { subSubCategory: '', customSubSubCategory: '', description: '' }),
        ...(name === 'subSubCategory' && value !== 'Other' && { customSubSubCategory: '' })
      };
      return newData;
    });
  };

  useEffect(() => {
    if (formData.category && formData.category !== 'Other' && formData.subCategory && formData.subCategory !== 'Other') {
      let autoDesc = formData.subCategory;
      const subSub = formData.subSubCategory === 'Other' ? formData.customSubSubCategory : formData.subSubCategory;
      if (subSub) {
        autoDesc += ` - ${subSub}`;
      }
      if (formData.subSubCategory !== 'Other' || (formData.subSubCategory === 'Other' && formData.customSubSubCategory)) {
        setFormData(prev => ({ ...prev, description: autoDesc }));
      }
    } else if (formData.description && (formData.subCategory === 'Other' || formData.subSubCategory === 'Other')) {
      // Don't auto-set if any is Other, allow manual
    }
  }, [formData.subCategory, formData.subSubCategory, formData.customSubSubCategory]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const dataToSend = {
        category: formData.category === 'Other' ? formData.customCategory : formData.category,
        subCategory: formData.subCategory === 'Other' ? formData.customSubCategory : formData.subCategory,
        subSubCategory: formData.subSubCategory === 'Other' ? formData.customSubSubCategory : formData.subSubCategory,
        description: formData.description,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
        escalatedPerson: formData.escalatedPerson,
        remarks: formData.remarks
      };
      await axios.post('http://localhost:5000/api/problems', dataToSend);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add problem");
    }
  };

  const isWanFirewall = formData.category === "WAN Firewalls";
  const isAccessPoints = formData.category === "Access Points";
  const currentSubCategories = isWanFirewall ? wanFirewallSubCategories : isAccessPoints ? accessPointSubCategories : [];
  const currentSubSubs = isWanFirewall ? wanSubSubCategories[formData.subCategory] || [] : isAccessPoints ? accessPointSubSubCategories[formData.subCategory] || [] : [];

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
      }}>Add New Problem</h2>
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
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat} style={{ padding: '0.5rem', color: '#1f2937' }}>
              {cat}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        {formData.category === 'Other' && (
          <input
            name="customCategory"
            placeholder="Specify category"
            value={formData.customCategory}
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
        )}
        {(isWanFirewall || isAccessPoints) && (
          <select
            name="subCategory"
            value={formData.subCategory}
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
            <option value="">Select Subcategory</option>
            {currentSubCategories.map(sub => (
              <option key={sub} value={sub} style={{ padding: '0.5rem', color: '#1f2937' }}>
                {sub}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        )}
        {formData.subCategory === 'Other' && (
          <input
            name="customSubCategory"
            placeholder="Specify subcategory"
            value={formData.customSubCategory}
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
        )}
        {(isWanFirewall || isAccessPoints) && currentSubSubs.length > 0 && (
          <select
            name="subSubCategory"
            value={formData.subSubCategory}
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
            <option value="">Select Sub-Subcategory</option>
            {currentSubSubs.map(subSub => (
              <option key={subSub} value={subSub} style={{ padding: '0.5rem', color: '#1f2937' }}>
                {subSub}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        )}
        {formData.subSubCategory === 'Other' && (
          <input
            name="customSubSubCategory"
            placeholder="Specify sub-subcategory"
            value={formData.customSubSubCategory}
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
        )}
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
        <label style={{
          display: 'block',
          marginBottom: '0.25rem',
          fontWeight: '600',
          color: '#1f2937'
        }}>Start Date & Time</label>
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
        <label style={{
          display: 'block',
          marginBottom: '0.25rem',
          fontWeight: '600',
          color: '#1f2937'
        }}>End Date & Time</label>
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
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, transform 0.3s'
          }}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#059669'; e.target.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = '#10b981'; e.target.style.transform = 'scale(1)'; }}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddProblem;