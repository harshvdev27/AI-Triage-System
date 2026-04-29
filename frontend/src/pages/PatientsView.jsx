import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { patients } from '../data/patients';
import RunTriageModal from '../components/triage/RunTriageModal';

const SEVERITY = {
  CRITICAL: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  HIGH: { bg: 'rgba(249,115,22,0.15)', color: '#f97316', border: 'rgba(249,115,22,0.3)' },
  MEDIUM: { bg: 'rgba(234,179,8,0.15)', color: '#eab308', border: 'rgba(234,179,8,0.3)' },
  LOW: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
};

const LAB_STATUS = {
  Normal: { color: '#22c55e' },
  Abnormal: { color: '#f97316' },
  Critical: { color: '#ef4444' },
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: '#e5e7eb',
  fontSize: '13px',
  outline: 'none',
};

const labelStyle = {
  color: '#9ca3af',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '6px',
};

function AddPatientModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', bloodGroup: 'O+',
    phone: '', address: '',
    ecName: '', ecRelation: '', ecPhone: '',
    allergies: '', chronicConditions: '',
  });

  if (!isOpen) return null;

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.age) {
      alert('Name and Age are required.');
      return;
    }

    const newId = `P${String(Date.now()).slice(-4)}`;
    const newPatient = {
      id: newId,
      name: form.name.trim(),
      age: parseInt(form.age),
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      phone: form.phone || 'N/A',
      address: form.address || 'N/A',
      password: 'pat123',
      role: 'patient',
      medicalHistory: {
        allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : ['None'],
        chronicConditions: form.chronicConditions ? form.chronicConditions.split(',').map(s => s.trim()).filter(Boolean) : ['None'],
        currentMedications: [],
        pastSurgeries: [],
        familyHistory: [],
      },
      emergencyContact: {
        name: form.ecName || 'N/A',
        relation: form.ecRelation || 'N/A',
        phone: form.ecPhone || 'N/A',
      },
      triageReports: [],
      labReports: [],
    };

    onAdd(newPatient);
    setForm({ name: '', age: '', gender: 'Male', bloodGroup: 'O+', phone: '', address: '', ecName: '', ecRelation: '', ecPhone: '', allergies: '', chronicConditions: '' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: '#1a1d29', borderRadius: '16px', width: '100%', maxWidth: '600px',
          maxHeight: '90vh', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.25)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0 }}>➕ Add New Patient</h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Patient name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Age *</label>
              <input type="number" value={form.age} onChange={handleChange('age')} placeholder="Age" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select value={form.gender} onChange={handleChange('gender')} style={inputStyle}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Blood Group</label>
              <select value={form.bloodGroup} onChange={handleChange('bloodGroup')} style={inputStyle}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input type="text" value={form.phone} onChange={handleChange('phone')} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input type="text" value={form.address} onChange={handleChange('address')} placeholder="Full address" style={inputStyle} />
            </div>
          </div>

          <div style={{
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '10px', padding: '16px', marginBottom: '16px',
          }}>
            <p style={{ ...labelStyle, marginBottom: '12px', color: '#a78bfa' }}>🆘 Emergency Contact</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Name</label>
                <input type="text" value={form.ecName} onChange={handleChange('ecName')} placeholder="Contact name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Relation</label>
                <input type="text" value={form.ecRelation} onChange={handleChange('ecRelation')} placeholder="e.g. Spouse" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="text" value={form.ecPhone} onChange={handleChange('ecPhone')} placeholder="Phone" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Allergies (comma-separated)</label>
              <input type="text" value={form.allergies} onChange={handleChange('allergies')} placeholder="e.g. Penicillin, Peanuts" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Chronic Conditions (comma-separated)</label>
              <input type="text" value={form.chronicConditions} onChange={handleChange('chronicConditions')} placeholder="e.g. Hypertension, Diabetes" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{
              padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: '#9ca3af',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={handleSubmit} style={{
              padding: '10px 24px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s',
            }}>✓ Add Patient</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PatientsView() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [expandedReport, setExpandedReport] = useState(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [patientsList, setPatientsList] = useState(patients);

  const filteredPatients = patientsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (severityFilter === 'All') return matchesSearch;
    return matchesSearch && p.triageReports.some(r => r.severity === severityFilter);
  });

  const getLastVisit = (p) => {
    const sorted = [...p.triageReports].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted[0]?.date || 'N/A';
  };

  const getHighestSeverity = (p) => {
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    for (const sev of severities) {
      if (p.triageReports.some(r => r.severity === sev)) return sev;
    }
    return 'LOW';
  };

  const handleRunNewTriage = () => {
    setIsTriageModalOpen(true);
  };

  const handleSaveReport = (report) => {
    const updatedPatients = patientsList.map(p => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          triageReports: [report, ...p.triageReports]
        };
      }
      return p;
    });
    
    setPatientsList(updatedPatients);
    const updatedPatient = updatedPatients.find(p => p.id === selectedPatient.id);
    setSelectedPatient(updatedPatient);
    
    alert(`Triage report saved for ${selectedPatient.name}`);
  };

  const handleAddPatient = (newPatient) => {
    const updated = [newPatient, ...patientsList];
    setPatientsList(updated);
    setSelectedPatient(newPatient);
  };

  return (
    <>
    <div style={{ display: 'flex', height: '100vh', background: '#0f1117', overflow: 'hidden' }}>
      
      {/* LEFT PANEL - Patient List */}
      <div style={{ width: '35%', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Search & Filters */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="🔍 Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#e5e7eb',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => setIsAddPatientOpen(true)}
              style={{
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.85'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              ➕ Add Patient
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: severityFilter === sev ? '#7c3aed' : 'rgba(255,255,255,0.05)',
                  color: severityFilter === sev ? '#fff' : '#9ca3af',
                  transition: 'all 0.2s',
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {filteredPatients.map(p => {
            const severity = getHighestSeverity(p);
            const sev = SEVERITY[severity];
            const isSelected = selectedPatient?.id === p.id;
            
            return (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPatient(p)}
                style={{
                  padding: '16px',
                  marginBottom: '10px',
                  background: isSelected ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 700, margin: '0 0 4px' }}>{p.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>ID: {p.id}</p>
                  </div>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: sev.bg,
                    color: sev.color,
                    border: `1px solid ${sev.border}`,
                  }}>
                    {severity}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#9ca3af' }}>
                  <span>👤 {p.age}y</span>
                  <span>🩸 {p.bloodGroup}</span>
                  <span>📅 {getLastVisit(p)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL - Patient Detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {selectedPatient ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div>
                <h1 style={{ color: '#e5e7eb', fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>
                  {selectedPatient.name}
                </h1>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#9ca3af' }}>
                  <span>ID: {selectedPatient.id}</span>
                  <span>•</span>
                  <span>{selectedPatient.age} years</span>
                  <span>•</span>
                  <span>{selectedPatient.gender}</span>
                  <span>•</span>
                  <span>🩸 {selectedPatient.bloodGroup}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleRunNewTriage}
                  style={{
                    padding: '10px 16px',
                    background: '#7c3aed',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#6d28d9'}
                  onMouseLeave={(e) => e.target.style.background = '#7c3aed'}
                >
                  🩺 Run New Triage
                </button>
              </div>
            </div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
                👤 PATIENT PROFILE
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px' }}>Phone</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', margin: 0 }}>{selectedPatient.phone}</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px' }}>Emergency Contact</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', margin: 0 }}>
                    {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relation})
                  </p>
                  <p style={{ color: '#a78bfa', fontSize: '12px', margin: 0 }}>{selectedPatient.emergencyContact.phone}</p>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 6px' }}>Address</p>
                <p style={{ color: '#e5e7eb', fontSize: '13px', margin: 0 }}>{selectedPatient.address}</p>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px' }}>Allergies</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedPatient.medicalHistory.allergies.map(a => (
                      <span key={a} style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'rgba(239,68,68,0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.25)',
                      }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px' }}>Chronic Conditions</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedPatient.medicalHistory.chronicConditions.map(c => (
                      <span key={c} style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'rgba(249,115,22,0.12)',
                        color: '#f97316',
                        border: '1px solid rgba(249,115,22,0.25)',
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Triage Reports */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: '20px' }}
            >
              <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
                🩺 TRIAGE REPORTS ({selectedPatient.triageReports.length})
              </p>
              
              {selectedPatient.triageReports.length === 0 ? (
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 8px' }}>No triage reports yet</p>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>Click "Run New Triage" to create the first report for this patient</p>
                </div>
              ) : (
              [...selectedPatient.triageReports].sort((a, b) => new Date(b.date) - new Date(a.date)).map(r => {
                const sev = SEVERITY[r.severity];
                const isExpanded = expandedReport === r.reportId;
                
                return (
                  <div
                    key={r.reportId}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '18px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>📅 {r.date}</span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: sev.bg,
                          color: sev.color,
                          border: `1px solid ${sev.border}`,
                        }}>
                          {r.severity}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: 'rgba(99,102,241,0.1)',
                          color: '#6366f1',
                        }}>
                          {r.status}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setExpandedReport(isExpanded ? null : r.reportId)}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(124,58,237,0.15)',
                          color: '#a78bfa',
                          border: '1px solid rgba(124,58,237,0.3)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? '▲ Collapse' : '▼ View Full'}
                      </button>
                    </div>

                    <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>
                      {r.chiefComplaint}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                      {[
                        ['BP', r.vitals.bp],
                        ['Pulse', r.vitals.pulse],
                        ['Temp', r.vitals.temp],
                        ['SpO₂', r.vitals.spo2],
                      ].map(([label, val]) => (
                        <div key={label} style={{
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '8px',
                          padding: '10px',
                        }}>
                          <p style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 3px' }}>
                            {label}
                          </p>
                          <p style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600, margin: 0 }}>{val}</p>
                        </div>
                      ))}
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginTop: '12px' }}
                      >
                        <div style={{
                          background: 'rgba(99,102,241,0.06)',
                          borderLeft: '3px solid #6366f1',
                          borderRadius: '0 8px 8px 0',
                          padding: '12px',
                          marginBottom: '10px',
                        }}>
                          <p style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px' }}>
                            AI ASSESSMENT
                          </p>
                          <p style={{ color: '#e5e7eb', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                            {r.aiAssessment}
                          </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                          <div>
                            <p style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>
                              DIAGNOSIS
                            </p>
                            <p style={{ color: '#e5e7eb', fontSize: '12px', margin: 0 }}>{r.diagnosis}</p>
                          </div>
                          <div>
                            <p style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>
                              DOCTOR ASSIGNED
                            </p>
                            <p style={{ color: '#e5e7eb', fontSize: '12px', margin: 0 }}>{r.doctorAssigned}</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                          <p style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>
                            TREATMENT
                          </p>
                          <p style={{ color: '#e5e7eb', fontSize: '12px', margin: 0 }}>{r.treatment}</p>
                        </div>

                        {r.followUp && (
                          <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                            📌 Follow-up: <span style={{ color: '#e5e7eb' }}>{r.followUp}</span>
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })
              )}
            </motion.div>

            {/* Lab Reports */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                overflowX: 'auto',
              }}
            >
              <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
                🔬 LAB REPORTS ({selectedPatient.labReports.length})
              </p>
              
              {selectedPatient.labReports.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>No lab reports available</p>
              ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr>
                    {['Test Name', 'Date', 'Result', 'Normal Range', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#9ca3af',
                        textAlign: 'left',
                        background: 'rgba(255,255,255,0.02)',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedPatient.labReports.map(l => (
                    <tr key={l.reportId}>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#e5e7eb', fontWeight: 500 }}>
                        {l.testName}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#9ca3af' }}>
                        {l.date}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#e5e7eb' }}>
                        {l.result}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#9ca3af' }}>
                        {l.normalRange}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: LAB_STATUS[l.status]?.color || '#9ca3af',
                          background: `${LAB_STATUS[l.status]?.color}18` || 'transparent',
                        }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </motion.div>

            {/* Medications */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
                💊 CURRENT MEDICATIONS ({selectedPatient.medicalHistory.currentMedications.length})
              </p>
              
              {selectedPatient.medicalHistory.currentMedications.length === 0 ? (
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                }}>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>No current medications</p>
                </div>
              ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {selectedPatient.medicalHistory.currentMedications.map((med, i) => {
                  const parts = med.split(' - ');
                  const drug = parts[0];
                  const dose = parts[1];
                  const freq = parts[2];
                  
                  return (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderLeft: '3px solid #7c3aed',
                        borderRadius: '10px',
                        padding: '16px',
                      }}
                    >
                      <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 700, margin: '0 0 8px' }}>
                        {drug}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {dose && (
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: 'rgba(124,58,237,0.12)',
                            color: '#a78bfa',
                          }}>
                            {dose}
                          </span>
                        )}
                        {freq && (
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: 'rgba(34,197,94,0.1)',
                            color: '#22c55e',
                          }}>
                            {freq}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </motion.div>

          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Select a patient to view details</p>
          </div>
        )}
      </div>
    </div>
    
    <RunTriageModal
      isOpen={isTriageModalOpen}
      onClose={() => setIsTriageModalOpen(false)}
      patient={{
        ...selectedPatient,
        allergies: selectedPatient?.medicalHistory?.allergies || [],
        chronicConditions: selectedPatient?.medicalHistory?.chronicConditions || [],
        currentMedications: selectedPatient?.medicalHistory?.currentMedications || []
      }}
      onSaveReport={handleSaveReport}
    />

    <AddPatientModal
      isOpen={isAddPatientOpen}
      onClose={() => setIsAddPatientOpen(false)}
      onAdd={handleAddPatient}
    />
    </>
  );
}

