import React, { useState } from 'react';
import { leadAPI } from '../services/api';
import { validateLeadForm } from '../utils/validation';
import './LeadForm.css';

const LeadForm = ({ onLeadAdded, editLead, onCancelEdit }) => {
  const [formData, setFormData] = useState(
    editLead || {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'New',
      notes: '',
      source: '',
    }
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation for the current field
    if (touched[name]) {
      const validationErrors = validateLeadForm({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: validationErrors[name] });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate the field that was just blurred
    const validationErrors = validateLeadForm(formData);
    setErrors({ ...errors, [name]: validationErrors[name] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all errors
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    const validationErrors = validateLeadForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (editLead) {
        await leadAPI.update(editLead._id, formData);
      } else {
        await leadAPI.create(formData);
      }
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Reset form if not in edit mode
      if (!editLead) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'New',
          notes: '',
          source: '',
        });
        setTouched({});
      }
      
      if (onLeadAdded) onLeadAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      console.error('Error saving lead:', error);
      setErrors({ submit: 'Failed to save lead. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="lead-form-container">
      <div className={`lead-form-card ${showSuccess ? 'success-animation' : ''}`}>
        <div className="form-header">
          <div className="form-icon">
            <img 
              src="https://www.integrate.com/wp-content/uploads/2025/04/Lead-Management-System_-Optimizing-Lead-Capture-and-Marketing-Efficiency.png" 
              alt="Lead Icon" 
              className="icon-img"
            />
          </div>
          <h2>{editLead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <p>{editLead ? 'Update lead information' : 'Capture new lead details'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <img src="data:image/png;base64,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" alt="User" className="input-icon" />
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                placeholder="Enter full name"
              />
              {errors.name && touched.name && (
                <div className="error-message">
                  <img src="https://img.icons8.com/fluency/20/000000/error.png" alt="Error" />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <img src="https://img.icons8.com/fluency/24/000000/email.png" alt="Email" className="input-icon" />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && touched.email && (
                <div className="error-message">
                  <img src="https://img.icons8.com/fluency/20/000000/error.png" alt="Error" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <img src="https://img.icons8.com/fluency/24/000000/phone.png" alt="Phone" className="input-icon" />
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && touched.phone && (
                <div className="error-message">
                  <img src="https://img.icons8.com/fluency/20/000000/error.png" alt="Error" />
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">
                <img src="https://img.icons8.com/fluency/24/000000/company.png" alt="Company" className="input-icon" />
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input"
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEX///8AAACurq739/eSkpL8/PyHh4efn5/Dw8Pe3t5qamoaGhpBQUGkpKTo6OiEhITJyckkJCRhYWHx8fEfHx/r6+vFxcUvLy/Q0NB7e3urq6vg4OATExNbW1szMzNFRUVTU1OWlpa6urpwcHALCws9PT1MTEx1dXVcXFwZrs0wAAALrElEQVR4nO1da3eqOhBF0SNYBRXf2Pqqrf//F17RPsxMAslkAuld7C/3rrNqyJDNvDKZBEGLFi1atGjRokWLFi3+B0huCJuehAuso3SzGc5ms9F+vz/c/jvb9MbdrOlpMSBM8uj83lFiN3rt5km/6WlSkUTHzUot3Q/e0m0UNz1Zc4S91/1OQ7wH5m/nY9MzNkGWd7Vle8Jlmf8NJTTZzijyFXjZdP2nazKcUuW74y31eh2z9dBKvAfSJGlaEAViOj1FzC+nRdPCSJD13njku2Pfa1oeiP7E7vPDOE+alknA+h+zfDe89DzSq//m/AJ2/NGr4dZk1tPpVN/V6Yx8CETCV52prs7puHvDaTKZnIr/GfcOex2ntXmNE1cLOD7leRKiAGKxSOLla5WU7x9RE2L9IExLp7effcaVQeApPZTr4W4dkiiQl5n4t8+x5lfUn3QvJbpq3pxSjfbqaQ0HRkoiSdKPEi7kzmQoQ19tA6dDimcZn+dKNdvEx9jvqWaz2lLdkUlPyYpT/WZDtYKjyCIyCBdL1QdZdw5AZQVHJ+uhlwoRL7WuYnyWz6LHEfVEG/ngwxpDqkRuwIZrnrxgmIzk49e2irFUwBWnvouktmNUk4ihlKIpr1mWv8WaiCr11E7cietkLHtMHY641NB/uNiCiGRe+cbBg0RIDT2LCsWIZWzZOnnUE2QrmLp6mIwv07Wrpz1wwo+cu3yk7IU6TVFl2FCtnD6wP37Bq+hw3zHEKW3XpJGxxqFCxV/+3n1wmqF4491Z1J/jFawj+l4jou4cfRkxepnOKfoAJurIzYOQXnurK3+CRfzn4jE48VvbzgJ2M5yYKCSgM0OPgU3/jD/MQM+oNxuNcgrs7zeGbnCdEfcN2QWKyLyIGbL1dee+TrDwiJlDKD3kRJmVAmqbFa8mhzm+tP5KrQxG/RvOOURu358e1lAV2Gcuf9CHeaFmdryQ4Xc39JxvaBP0r64WMQObaKt63FEM+LGcuQaGirS5LUsQgLM5xkCR7psrWJqAQIppuwZyo8nigQH4XlhedghNLcegVGQHcS4s3ilkxphjUDJgDMeRlQL1vquGSyOBhAy6JgFOfZO1HwVANmxoP2IialJ3irSrRw6QDtvbUwq8M2eKdKy5AQrcj529AwlcUuvxFCgUtt4GaCSWpHzaBqqxKODFcjgVHhZJK2/QFw2G9cYe2KdcWg5X8RQtooItaFvVJ76wFzflV78+hQ5RE1FCy2zDWixP3zjJzjw7TTpEFSW0VA2gQN2JMRQ/BA2iAvVuxyvx6U7S+NDtrSYqMIlW9iIUy5NmNmMpgOsCKgsbF6IF+7R5/ELcbnJQPSerKalalPBT+PODjb0A1pD/M5RVdlSzTgwGLjbfDnjD7BvoEgFfNF4jyCvavHhxP+TDYiQpZBTVmS6o7LMpsRHtPVtq6ws0ihYQd1FsXFPK07VBpCj+qY0fIj6f1xpSKVpgIvzqQI9Z18JAc1anlE7RANl8+sTEbD5reG9B0QJc5BKJNGLMQdlQtADXGoo+G+OeoRVFC4gBAd3XEmNNrURprDNRS4oGMLwYGP32GWLSR2cO8f6lemPKlqIBzO7TDbWxhOupBt2sKRpACa+Gv/6FqYRfBfblq2hP0QBKSI/qDCX8Lu0rLclioGjAJqHo4E6rytjWvwpOTToOigYwfno3H+CBRIh/qyQUzoCoVpGFogEKXAkj3GEkoVh9qiAqD0VvWBwHz6AMUcBEwjWs55FRj4mifAiF8HBXVtshOaaEV5GLoozQ16VHPHlEVDaKMsLAWsiOfogE9I6iBQwklJ6Hel5FDykamFl82RmlJ6L6SNEARk9VOrmMqF5SNIASVqW0SojqJ0UDqCErU1pKonpK0QD6RpfqLIacqL5S9IZMnFV1OkRK1CP+Jz8oWsBUwrJ2IM/wRsBALOzQcnB1RPSEogXEii+tCit1z5Nv+EPRAGp5vUCzkqg+CQjrEjV/VS6iRxQN0P6AZm18GVG9ougNiVhOo1uRW0JUzwQM+mJu+VX7hyoR/aJoAfFDrEy3/UBOVN8oWgCoGv0dcylRPRQQJKM6M4NqDCyifxQNcMcrg506SFQfKVoAnAgymSUgqqcCoj4KRj9+FtFLit4BDgAbFXb8EtVXihYAJ43MavV/iOqxgNCtMS0x/cdM0TDJ4zgaDAbrOM7zhKPSDpQ6mlYFFETlomj/1O1tngO6+X64PdkX11seiLsRlUfA5HyQNf/cvXwOLKvPM3CmxPhAHEOxWJiXt/Odja1qfeDgtXcSzVS9Ip+p1bWo2JqAweo+Q5q/anUAt2nF7+p8sRYW1ev3A/I6wrPcNTaD74912pp/Y0ot+Ybn8Tu1HSNNTG/MeCO2Cojgh8ArhxKUC3lozXhD2K7BeXvGO46kKxeGJD8HHsm3OuKgC2kDUw3QTiTCfolX98qmMneuBkVEuIjujaKFgLRqZpR1cRzRllF0Nypu3zuU/MWIsIox7LXlts2QQovuDufnOwUnveFcfjMfpWs0arnnslVUF3ctveFjgPsxL09yk0lptoYGcdjuSzpphU+WyVvx98wXQNKe0dEqom5JN8zLXMXoQ8JV866OfewCu2lzEkrS5deK+Uo0L6EZb4j6l74w9hP7BW4625lVqf8wQb+hGDTJKC6aFqMOiVqWCfc4pmh73MKU86TQF2L4DM1E1gKJSGjKJ7m3442dqOheAt1EVohacRPmhoKMDrtGjaBa1HeeQmga94TnIwp1SJanZJZQY5voa9Q1muJ3IRe8w2v6oTabGn3o0GaTDkTJLrpJ+fQN+NJNs16WP78jPEpE5OuSDhJPpunnBORbaMkIbK86bO4NpJlxiAD2IGhqUHJ/QIerwzYgiHlLPdiUj3aAFtvWAlZ59e+RRZO2I3zfwCshBurYtt5xsO59Ahr+kFIl4pyoHfjlRLVXqtQCpWeAt0+dipyoN17Z3cYoBkG0BgDAYpNjA+R7fMPmitsFR6cRUD1i8cbXyow0maugCyXNyILXZKMbJsptoV1vQiIYeP1EgoHGJ7RBHkCnKn8xHR0JoQvP2VfQHY04ygNhWrY7u3o1vehelHBFnJWokG37k3XLN6BHve7E4FMXJaTO7STM6WC7wzKRG/9fTC/D3kBzLXnevug2MLRw1bw4fnXtDQbHPC5TQTx9BNgl7Cvy6gqUaW8XErLkyrKlQTlB2dGiowMJ9avvSxGn8i0gQwlFe0jtBSHuY7D1etQoW6qWkMceivETXzdL1RW39DXkkdCqMyZEfNbgaqmEYjaQdicYuNaI+V6oaCPd2tSVEJQm0WoFElHtce+PhcmhQq+WSQiqdWkuJaC6i8vhorPyDvgKCcEnRCsRBClTmgxVWJyOyrCjVELyIaQniByibF3oIckVC1kqYSyWzVOynSCJcaBNXxPJOJ3NYfBRflwaOIDmOVh4NZX7MsrlaTu47i+6EoJsp7muAUlzBr9bB1mSxPkgvd4LmSqOvIMVN03owlLYJm/9UQA4Rh+G8SvYGaNlXN0C7k+apcrgPZSj5q6mUgJ4JIYFLbAGwEOSSmr2DHh6hL91N00LWFx42oU56mavplIC5X30btiRlBg0fTWVEmi3QK9YFJekenvoEddCaJTfZwP0Ys4eKtIHMlyWVHmmKUSVVDbdhZ0DVVx3KvazMlz72sR9vgbAFYKle69rWcKW9S5dfkgLWhR7r8lQGov6ezr+DlSD94XZOH9WH1miPFvquYBBkCtTk4fe+DQp0N1uh8qcUD0Hs6yQqeZ+w/u0QMkf+OmPQmR6CWYpPPXWIDRz6H91BQtQV/EPfIPfUFVelWLlvRZ9xsL8mOy+qTvDqVDX7MiRujgA4haxyVnZ659i6A+0915X+OzeH4Hm3mtaa6sHbsRnxVnRL+wOf8YGKrE8Xd9U8snOlv5FZMlYciap857m3mYrKMi6g81wNvvY70ez2Wca/TXrp40sMS17bNGiRYsWLVq0aNGiRZ34D1ypimE+ZX4uAAAAAElFTkSuQmCC" alt="Status" className="input-icon" />
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="source" className="form-label">
                <img src="data:image/png;base64,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" alt="Source" className="input-icon" />
                Source
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input"
                placeholder="How did you find this lead?"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="notes" className="form-label">
              <img src="data:image/jpeg;base64,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" alt="Notes" className="input-icon" />
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-textarea"
              placeholder="Additional notes about this lead"
              rows="3"
            />
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              <img src="https://img.icons8.com/fluency/20/000000/error.png" alt="Error" />
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? (
                <>
                  <img src="https://img.icons8.com/fluency/20/000000/spinner-frame-5.png" className="spinner" alt="Loading" />
                  Saving...
                </>
              ) : (
                <>
                  <img src="https://img.icons8.com/fluency/20/000000/save.png" alt="Save" />
                  {editLead ? 'Update Lead' : 'Add Lead'}
                </>
              )}
            </button>
            {editLead && (
              <button type="button" onClick={handleCancel} className="cancel-btn">
                <img src="https://img.icons8.com/fluency/20/000000/cancel.png" alt="Cancel" />
                Cancel
              </button>
            )}
          </div>
        </form>

        {showSuccess && (
          <div className="success-overlay">
            <div className="success-checkmark">
              <img src="https://img.icons8.com/fluency/96/000000/checked.png" alt="Success" />
            </div>
            <p className="success-message">Lead {editLead ? 'Updated' : 'Added'} Successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadForm;