import React from 'react';

const LeadStats = ({ leads }) => {
  const stats = {
    total: leads.length,
    new: leads.filter(lead => lead.status === 'New').length,
    contacted: leads.filter(lead => lead.status === 'Contacted').length,
    qualified: leads.filter(lead => lead.status === 'Qualified').length,
    lost: leads.filter(lead => lead.status === 'Lost').length
  };

  return (
    <div className="lead-stats">
      <h3>Lead Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Leads</span>
        </div>
        <div className="stat-card new">
          <span className="stat-number">{stats.new}</span>
          <span className="stat-label">New</span>
        </div>
        <div className="stat-card contacted">
          <span className="stat-number">{stats.contacted}</span>
          <span className="stat-label">Contacted</span>
        </div>
        <div className="stat-card qualified">
          <span className="stat-number">{stats.qualified}</span>
          <span className="stat-label">Qualified</span>
        </div>
        <div className="stat-card lost">
          <span className="stat-number">{stats.lost}</span>
          <span className="stat-label">Lost</span>
        </div>
      </div>
    </div>
  );
};

export default LeadStats;