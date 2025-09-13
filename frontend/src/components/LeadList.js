import React, { useState } from 'react';
import LeadForm from './LeadForm';
import { leadAPI } from '../services/api';
import './LeadList.css';

const LeadList = ({ leads, onLeadUpdated }) => {
  const [editingLead, setEditingLead] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingLead(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    setDeletingId(id);
    setError(null);
    
    try {
      await leadAPI.delete(id);
      
      // Call the parent component's update function to refresh the list
      if (onLeadUpdated) {
        onLeadUpdated();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      
      // More specific error message
      if (error.response) {
        setError(`Failed to delete lead: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.message) {
        setError(`Failed to delete lead: ${error.message}`);
      } else {
        setError('Failed to delete lead. Please try again.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'status-new';
      case 'Contacted':
        return 'status-contacted';
      case 'Qualified':
        return 'status-qualified';
      case 'Lost':
        return 'status-lost';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New':
        return '🆕';
      case 'Contacted':
        return '📞';
      case 'Qualified':
        return '✅';
      case 'Lost':
        return '❌';
      default:
        return '';
    }
  };

  if (editingLead) {
    return (
      <LeadForm
        editLead={editingLead}
        onLeadAdded={onLeadUpdated}
        onCancelEdit={handleCancelEdit}
      />
    );
  }

  return (
    <div className="lead-list-container">
      <div className="lead-list-header">
        <h2>
          <img 
            src="https://img.icons8.com/fluency/48/000000/contacts.png" 
            alt="Leads" 
            className="header-icon"
          />
          Lead Management Dashboard
        </h2>
        <p>Track and manage your sales pipeline efficiently</p>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError(null)} className="dismiss-error">
            <img src="https://img.icons8.com/fluency/20/000000/close-window.png" alt="Close" />
          </button>
        </div>
      )}
      
      {leads.length === 0 ? (
        <div className="empty-state">
          <img 
            src="https://img.icons8.com/fluency/96/000000/nothing-found.png" 
            alt="No leads" 
            className="empty-icon"
          />
          <h3>No Leads Found</h3>
          <p>Start building your pipeline by adding your first lead</p>
          <div className="empty-cta">
            <img 
              src="data:image/jpeg;base64,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" 
              alt="Arrow down" 
            />
            Use the form above to get started
          </div>
        </div>
      ) : (
        <div className="leads-table-container">
          <div className="table-stats">
            <div className="stat-item">
              <span className="stat-number">{leads.length}</span>
              <span className="stat-label">Total Leads</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {leads.filter(lead => lead.status === 'New').length}
              </span>
              <span className="stat-label">New</span>
            </div>
          </div>
          
          <div className="leads-table">
            <div className="table-header">
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Company</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {leads.map((lead, index) => (
              <div 
                key={lead._id} 
                className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="cell-content">
                  <img 
                    src="data:image/jpeg;base64,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" 
                    alt="Name" 
                    className="cell-icon"
                  />
                  <span className="bold-text">{lead.name}</span>
                </div>
                <div className="cell-content">
                  <img 
                    src="https://img.icons8.com/fluency/20/000000/email.png" 
                    alt="Email" 
                    className="cell-icon"
                  />
                  <span className="bold-text">{lead.email}</span>
                </div>
                <div className="cell-content">
                  <img 
                    src="https://img.icons8.com/fluency/20/000000/phone.png" 
                    alt="Phone" 
                    className="cell-icon"
                  />
                  <span className="bold-text">{lead.phone || '-'}</span>
                </div>
                <div className="cell-content">
                  <img 
                    src="https://img.icons8.com/fluency/20/000000/company.png" 
                    alt="Company" 
                    className="cell-icon"
                  />
                  <span className="bold-text">{lead.company || '-'}</span>
                </div>
                <div>
                  <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                    <span className="status-icon">{getStatusIcon(lead.status)}</span>
                    {lead.status}
                  </span>
                </div>
                <div className="actions">
                  <button 
                    onClick={() => handleEdit(lead)} 
                    className="edit-btn"
                    title="Edit lead"
                  >
                    <img 
                      src="https://img.icons8.com/fluency/20/000000/edit.png" 
                      alt="Edit" 
                    />
                  </button>
                  <button 
                    onClick={() => handleDelete(lead._id)} 
                    disabled={deletingId === lead._id}
                    className="delete-btn"
                    title="Delete lead"
                  >
                    {deletingId === lead._id ? (
                      <img 
                        src="https://img.icons8.com/fluency/20/000000/spinner-frame-5.png" 
                        className="spinner" 
                        alt="Deleting" 
                      />
                    ) : (
                      <img 
                        src="https://img.icons8.com/fluency/20/000000/delete.png" 
                        alt="Delete" 
                      />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;