import React from 'react';

const LeadFilters = ({ filters, onFilterChange, sortConfig, onSort }) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div className="lead-filters">
      <div className="filters-header">
        <img src="https://img.icons8.com/fluency/24/000000/filter.png" alt="Filter" />
        <h3>Filter & Sort Leads</h3>
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="status-filter" className="filter-label">
            <img src="https://img.icons8.com/fluency/20/000000/status.png" alt="Status" />
            Status:
          </label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">
            <img src="https://img.icons8.com/fluency/20/000000/search.png" alt="Search" />
            Search:
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, email, or company"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <button 
            onClick={() => onFilterChange({ status: '', search: '' })}
            className="clear-filters-btn"
          >
            <img src="https://img.icons8.com/fluency/20/000000/clear-filters.png" alt="Clear" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;