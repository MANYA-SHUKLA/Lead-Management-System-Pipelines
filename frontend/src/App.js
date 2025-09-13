import React, { useState, useEffect } from 'react';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';
import ErrorBoundary from './components/ErrorBoundary';
import { useLeads } from './hooks/useLeads';
import './App.css';


function App() {
  const { leads, loading, error: leadsError, refreshLeads } = useLeads();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sync error from useLeads to local error state
  useEffect(() => {
    if (leadsError) setError(leadsError);
  }, [leadsError]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="loading-logo-container">
            <img 
              src="https://img.icons8.com/fluency/96/000000/contacts.png" 
              alt="Loading" 
              className="loading-logo"
            />
            <div className="loading-pulse"></div>
          </div>
          <h1>Lead Management System</h1>
          <p>Initializing your sales dashboard...</p>
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              animationDelay: `${i * 0.5}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}></div>
          ))}
        </div>
      </div>
      
      <header className="App-header">
        <div className="header-glow"></div>
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="https://archizsolutions.com/wp-content/uploads/2019/01/Leads-Management-System-1.jpg" 
              alt="Lead Management" 
              className="header-logo"
            />
            <div className="logo-badge">PRO</div>
          </div>
          <div className="header-text">
            <h1>
              <span className="header-title-main">Lead Management</span>
              <span className="header-title-sub">System</span>
            </h1>
            <p className="header-description">
              <span className="description-text">Transform your sales pipeline with powerful lead management</span>
              <span className="description-sparkle">✨</span>
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{leads.length}</span>
              <span className="stat-label">Total Leads</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {leads.filter(lead => lead.status === 'New').length}
              </span>
              <span className="stat-label">New Leads</span>
            </div>
          </div>
        </div>
        <div className="header-wave">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </header>
      
      <main className="App-main">
        <ErrorBoundary>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
              <button onClick={() => setError(null)} className="dismiss-error">
                ×
              </button>
            </div>
          )}
          
          <div className="container">
            <ErrorBoundary>
              <LeadForm onLeadAdded={refreshLeads} />
            </ErrorBoundary>
            
            {loading ? (
              <div className="loading-section">
                <div className="loading-spinner large"></div>
                <p>Loading leads...</p>
              </div>
            ) : (
              <ErrorBoundary>
                <LeadList leads={leads} onLeadUpdated={refreshLeads} />
              </ErrorBoundary>
            )}
          </div>
        </ErrorBoundary>
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <p>© 2025 Lead Management System | Built with React & Node.js</p>
          <p className="footer-author">Crafted with ❤️ by MANYA SHUKLA</p>
        </div>
      </footer>
    </div>
  );
}

export default App;