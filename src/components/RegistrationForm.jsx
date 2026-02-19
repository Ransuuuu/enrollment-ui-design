import { useState, useRef } from 'react';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    religion: '',
    email: '',
    mobileNumber: '',
    landline: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
    gsSchoolName: '',
    gsYearGraduated: '',
    gsSchoolAddress: '',
    jhsSchoolName: '',
    jhsYearGraduated: '',
    jhsSchoolAddress: '',
    shsSchoolName: '',
    shsYearGraduated: '',
    shsGradeAverage: '',
    shsSchoolAddress: '',
    academicLevel: '',
    semester: '',
    campus: '',
    collegeDepartment: '',
    degreeProgram: '',
  });

  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    contact: false,
    academic: false,
    enrollment: false,
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const formRef = useRef(null);

  // Define required fields
  const requiredFields = [
    'firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'religion',
    'email', 'mobileNumber', 'street', 'barangay', 'city', 'province', 'zipCode',
    'shsSchoolName', 'shsYearGraduated', 'shsGradeAverage', 'shsSchoolAddress',
    'academicLevel', 'semester', 'campus', 'collegeDepartment', 'degreeProgram'
  ];

  // Validation functions
  const validateNameInput = (value) => {
    // Allow only letters, spaces, hyphens, and apostrophes
    return /^[a-zA-Z\s\-']*$/.test(value);
  };

  const validatePhoneInput = (value) => {
    // Allow only digits, spaces, hyphens, and plus sign
    return /^[0-9\s\-+()]*$/.test(value);
  };

  const validateZipCode = (value) => {
    // Allow only digits - max 4 digits
    if (value === '') return true;
    return /^\d{0,4}$/.test(value);
  };

  const validateMobileNumber = (value) => {
    // Allow only digits - max 11 digits
    if (value === '') return true;
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length <= 11;
  };

  const validateLandline = (value) => {
    // Allow only digits - max 8 digits
    if (value === '') return true;
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length <= 8;
  };

  const validateYearInput = (value) => {
    // Allow only 4 digits
    if (value === '') return true;
    return /^\d{0,4}$/.test(value);
  };

  const validateGradeAverage = (value) => {
    // Allow only numbers with up to 2 decimal places
    if (value === '') return true;
    return /^\d+\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Apply validations based on field type
    let validatedValue = value;

    if (['firstName', 'middleName', 'lastName', 'suffix', 'religion'].includes(name)) {
      if (!validateNameInput(value)) return; // Reject invalid input
      validatedValue = value;
    }

    if (name === 'mobileNumber') {
      if (!validatePhoneInput(value)) return;
      if (!validateMobileNumber(value)) return; // Max 11 digits
      validatedValue = value;
    }

    if (name === 'landline') {
      if (!validatePhoneInput(value)) return;
      if (!validateLandline(value)) return; // Max 8 digits
      validatedValue = value;
    }

    if (name === 'zipCode') {
      if (!validateZipCode(value)) return; // Max 4 digits
      validatedValue = value;
    }

    if (['gsYearGraduated', 'jhsYearGraduated', 'shsYearGraduated'].includes(name)) {
      if (!validateYearInput(value)) return;
      validatedValue = value;
    }

    if (name === 'shsGradeAverage') {
      if (!validateGradeAverage(value)) return;
      validatedValue = value;
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: validatedValue
      };
      
      // Reset degree program if academic level changes
      if (name === 'academicLevel' && prev.academicLevel !== validatedValue) {
        updated.degreeProgram = '';
        updated.collegeDepartment = ''; // Also reset department
      }
      
      return updated;
    });

    // Clear error for this field when user starts typing
    if (errorFields[name]) {
      setErrorFields(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for incomplete required fields
    const incompleteFields = {};
    requiredFields.forEach(fieldName => {
      if (!formData[fieldName] || formData[fieldName].toString().trim() === '') {
        incompleteFields[fieldName] = true;
      }
    });

    // If there are incomplete fields, show error
    if (Object.keys(incompleteFields).length > 0) {
      setErrorFields(incompleteFields);
      setSubmitStatus('error');
      
      // Find first incomplete field and scroll to it
      const firstIncompleteField = requiredFields.find(field => incompleteFields[field]);
      const firstIncompleteElement = document.getElementById(firstIncompleteField);
      
      if (firstIncompleteElement) {
        firstIncompleteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstIncompleteElement.focus();
      }
      
      // Clear error status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }

    // All fields are complete - show success message
    console.log('Form submitted successfully:', formData);
    setErrorFields({});
    setSubmitStatus('success');
    
    // Scroll to top to see success message
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Keep success message visible longer
    setTimeout(() => setSubmitStatus(null), 6000);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      religion: '',
      email: '',
      mobileNumber: '',
      landline: '',
      street: '',
      barangay: '',
      city: '',
      province: '',
      zipCode: '',
      gsSchoolName: '',
      gsYearGraduated: '',
      gsSchoolAddress: '',
      jhsSchoolName: '',
      jhsYearGraduated: '',
      jhsSchoolAddress: '',
      shsSchoolName: '',
      shsYearGraduated: '',
      shsGradeAverage: '',
      shsSchoolAddress: '',
      academicLevel: '',
      semester: '',
      campus: '',
      collegeDepartment: '',
      degreeProgram: '',
    });
    setTouchedFields({});
  };

  const buttonDisableHandler = (e) => {
    return false;
  };

  const calculateProgress = () => {
    const filledFields = Object.values(formData).filter(val => val !== '').length;
    const totalFields = Object.keys(formData).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  // Degree programs organized by academic level
  const degreePrograms = {
    Undergraduate: [
      {
        category: 'College of Engineering and Architecture',
        programs: [
          'BS Architecture',
          'BS Chemical Engineering',
          'BS Civil Engineering',
          'BS Computer Engineering',
          'BS Electrical Engineering',
          'BS Electronics Engineering',
          'BS Industrial Engineering',
          'BS Mechanical Engineering'
        ]
      },
      {
        category: 'College of Computer Studies',
        programs: [
          'BS Computer Science',
          'BS Data Science and Analytics',
          'BS Entertainment and Multimedia Computing',
          'BS Information Technology'
        ]
      },
      {
        category: 'College of Business Education',
        programs: [
          'BS Accountancy',
          'BS Accounting Information System',
          'BS Business Administration',
          'Financial Management',
          'Human Resource Management',
          'Logistics and Supply Chain Management',
          'Marketing Management'
        ]
      },
      {
        category: 'College of Arts',
        programs: [
          'Bachelor of Arts in English Language',
          'Bachelor of Arts in Political Science'
        ]
      }
    ],
    Graduate: [
      {
        category: 'Doctorate Degrees',
        programs: [
          'Doctor in Information Technology',
          'Doctor of Engineering - Computer Engineering',
          'Doctor of Philosophy in Computer Science'
        ]
      },
      {
        category: 'Master\'s Degrees',
        programs: [
          'Master in Information Systems',
          'Master in Information Technology',
          'Master in Logistics and Supply Chain Management',
          'Master of Engineering - Civil Engineering',
          'Master of Engineering - Computer Engineering',
          'Master of Engineering - Electrical Engineering',
          'Master of Engineering - Electronics Engineering',
          'Master of Engineering - Industrial Engineering',
          'Master of Engineering - Mechanical Engineering',
          'Master of Science in Computer Science'
        ]
      }
    ]
  };

  // Departments organized by academic level
  const departments = {
    Undergraduate: [
      { value: 'Engineering', label: 'College of Engineering and Architecture' },
      { value: 'ComputerStudies', label: 'College of Computer Studies' },
      { value: 'Business', label: 'College of Business Education' },
      { value: 'Arts', label: 'College of Arts' }
    ],
    Graduate: [
      { value: 'GraduateEng', label: 'Graduate Engineering Programs' },
      { value: 'GraduateCS', label: 'Graduate Computer Science Programs' },
      { value: 'GraduateOther', label: 'Graduate Other Programs' }
    ]
  };

  // Get filtered degree programs based on academic level
  const getFilteredDegreePrograms = () => {
    if (!formData.academicLevel) return [];
    return degreePrograms[formData.academicLevel] || [];
  };

  // Get filtered departments based on academic level
  const getFilteredDepartments = () => {
    if (!formData.academicLevel) return [];
    return departments[formData.academicLevel] || [];
  };

  return (
    <div className="registration-container">
      <div className="header-section">
        <h1>🎓 ADEi University Student Registration</h1>
        <p className="subtitle">Complete your enrollment in just a few steps</p>
        
        {/* Progress Bar */}
        <div className="progress-wrapper">
          <div className="progress-info">
            <span className="progress-text">Progress</span>
            <span className="progress-percentage">{calculateProgress()}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="success-message">
          ✅ You successfully enrolled! Our team will review your application soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="completion-message">
          ⚠️ Please complete all required fields before submitting. Scroll to the highlighted fields above.
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form" ref={formRef}>
        
        {/* PERSONAL INFORMATION SECTION */}
        <fieldset className={`form-section ${expandedSections.personal ? 'expanded' : 'collapsed'}`}>
          <legend 
            className="section-header"
            onClick={() => toggleSection('personal')}
            role="button"
            tabIndex="0"
          >
            <span className="section-icon">👤</span>
            <span className="section-title">Personal Information</span>
            <span className={`toggle-icon ${expandedSections.personal ? 'open' : ''}`}>▼</span>
          </legend>
          
          <div className={`section-content ${expandedSections.personal ? 'show' : ''}`}>
            <div className="form-row four-columns">
              <div className={`form-group ${errorFields.firstName ? 'error' : ''}`}>
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('firstName')}
                    placeholder="Letters only"
                    required 
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Letters, spaces, hyphens only</small>
                {errorFields.firstName && <div className="error-message">❌ This field is required</div>}
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="middleName" 
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('middleName')}
                    placeholder="Letters only"
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Letters, spaces, hyphens only</small>
              </div>

              <div className={`form-group ${errorFields.lastName ? 'error' : ''}`}>
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('lastName')}
                    placeholder="Letters only"
                    required 
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Letters, spaces, hyphens only</small>
                {errorFields.lastName && <div className="error-message">❌ This field is required</div>}
              </div>

              <div className="form-group">
                <label htmlFor="suffix">Suffix</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="suffix" 
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('suffix')}
                    placeholder="Jr., Sr., III"
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Letters, spaces, hyphens only</small>
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="dateOfBirth">📅 Date of Birth</label>
                <div className="input-wrapper">
                  <input 
                    type="date" 
                    id="dateOfBirth" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('dateOfBirth')}
                    onKeyDown={buttonDisableHandler}
                    required 
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gender">👥 Gender</label>
                <div className="select-wrapper">
                  <select 
                    id="gender" 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('gender')}
                    required
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="nationality">🌍 Nationality</label>
                <div className="select-wrapper">
                  <select 
                    id="nationality" 
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('nationality')}
                    required
                  >
                    <option value="">-- Select Nationality --</option>
                    <option value="Filipino">Filipino</option>
                    <option value="American">American</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Thai">Thai</option>
                    <option value="Indian">Indian</option>
                    <option value="Malaysian">Malaysian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="religion">⛪ Religion</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="religion" 
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('religion')}
                    placeholder="Letters only"
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Letters, spaces, hyphens only</small>
              </div>
            </div>
          </div>
        </fieldset>

        {/* CONTACT DETAILS SECTION */}
        <fieldset className={`form-section ${expandedSections.contact ? 'expanded' : 'collapsed'}`}>
          <legend 
            className="section-header"
            onClick={() => toggleSection('contact')}
            role="button"
            tabIndex="0"
          >
            <span className="section-icon">📞</span>
            <span className="section-title">Contact Details</span>
            <span className={`toggle-icon ${expandedSections.contact ? 'open' : ''}`}>▼</span>
          </legend>
          
          <div className={`section-content ${expandedSections.contact ? 'show' : ''}`}>
            <div className="form-row two-columns">
              <div className={`form-group ${errorFields.email ? 'error' : ''}`}>
                <label htmlFor="email">📧 Email Address</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('email')}
                    placeholder="your.email@example.com"
                    required 
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Valid email format required</small>
                {errorFields.email && <div className="error-message">❌ This field is required</div>}
              </div>

              <div className={`form-group ${errorFields.mobileNumber ? 'error' : ''}`}>
                <label htmlFor="mobileNumber">📱 Mobile Number</label>
                <div className="input-wrapper">
                  <input 
                    type="tel" 
                    id="mobileNumber" 
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('mobileNumber')}
                    placeholder="+63 9XX XXXX XXX"
                    maxLength="11"
                    required 
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Maximum 11 digits (numbers only)</small>
                {errorFields.mobileNumber && <div className="error-message">❌ This field is required</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="landline">☎️ Landline</label>
              <div className="input-wrapper">
                <input 
                  type="tel" 
                  id="landline" 
                  name="landline"
                  value={formData.landline}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('landline')}
                  placeholder="(02) XXXX XXXX"
                  maxLength="8"
                />
                <span className="focus-border"></span>
              </div>
              <small className="input-hint">Maximum 8 digits (numbers only)</small>
            </div>

            <div className="address-section">
              <h3>📍 Complete Home Address</h3>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label htmlFor="street">Street Address</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="street" 
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('street')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="barangay">Barangay</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="barangay" 
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('barangay')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>
              </div>

              <div className="form-row two-columns">
                <div className="form-group">
                  <label htmlFor="city">City/Municipality</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="city" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('city')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="province">Province</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="province" 
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('province')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('zipCode')}
                    placeholder="e.g., 1000"
                    maxLength="4"
                    required 
                  />
                  <span className="focus-border"></span>
                </div>
                <small className="input-hint">Maximum 4 digits</small>
              </div>
            </div>
          </div>
        </fieldset>

        {/* ACADEMIC HISTORY SECTION */}
        <fieldset className={`form-section ${expandedSections.academic ? 'expanded' : 'collapsed'}`}>
          <legend 
            className="section-header"
            onClick={() => toggleSection('academic')}
            role="button"
            tabIndex="0"
          >
            <span className="section-icon">🎓</span>
            <span className="section-title">Academic History</span>
            <span className={`toggle-icon ${expandedSections.academic ? 'open' : ''}`}>▼</span>
          </legend>

          <div className={`section-content ${expandedSections.academic ? 'show' : ''}`}>
            {/* Grade School */}
            <div className="academic-subsection">
              <div className="subsection-header">
                <h3>📚 Grade School</h3>
              </div>
              
              <div className="form-row three-columns">
                <div className="form-group">
                  <label htmlFor="gsSchoolName">School Name</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="gsSchoolName" 
                      name="gsSchoolName"
                      value={formData.gsSchoolName}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('gsSchoolName')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="gsYearGraduated">Year Graduated</label>
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      id="gsYearGraduated" 
                      name="gsYearGraduated"
                      value={formData.gsYearGraduated}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('gsYearGraduated')}
                      min="1900"
                      max="2026"
                      placeholder="YYYY"
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                  <small className="input-hint">Numeric year only</small>
                </div>

                <div className="form-group">
                  <label htmlFor="gsSchoolAddress">School Address</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="gsSchoolAddress" 
                      name="gsSchoolAddress"
                      value={formData.gsSchoolAddress}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('gsSchoolAddress')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Junior High School */}
            <div className="academic-subsection">
              <div className="subsection-header">
                <h3>📚 Junior High School</h3>
              </div>
              
              <div className="form-row three-columns">
                <div className="form-group">
                  <label htmlFor="jhsSchoolName">School Name</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="jhsSchoolName" 
                      name="jhsSchoolName"
                      value={formData.jhsSchoolName}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('jhsSchoolName')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="jhsYearGraduated">Year Graduated</label>
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      id="jhsYearGraduated" 
                      name="jhsYearGraduated"
                      value={formData.jhsYearGraduated}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('jhsYearGraduated')}
                      min="1900"
                      max="2026"
                      placeholder="YYYY"
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                  <small className="input-hint">Numeric year only</small>
                </div>

                <div className="form-group">
                  <label htmlFor="jhsSchoolAddress">School Address</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="jhsSchoolAddress" 
                      name="jhsSchoolAddress"
                      value={formData.jhsSchoolAddress}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('jhsSchoolAddress')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Senior High School */}
            <div className="academic-subsection">
              <div className="subsection-header">
                <h3>📚 Senior High School</h3>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shsSchoolName">School Name</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="shsSchoolName" 
                      name="shsSchoolName"
                      value={formData.shsSchoolName}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('shsSchoolName')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="shsYearGraduated">Year Graduated</label>
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      id="shsYearGraduated" 
                      name="shsYearGraduated"
                      value={formData.shsYearGraduated}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('shsYearGraduated')}
                      min="1900"
                      max="2026"
                      placeholder="YYYY"
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                  <small className="input-hint">Numeric year only</small>
                </div>

                <div className="form-group">
                  <label htmlFor="shsGradeAverage">Grade Average</label>
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      id="shsGradeAverage" 
                      name="shsGradeAverage"
                      value={formData.shsGradeAverage}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('shsGradeAverage')}
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                  <small className="input-hint">0-100 (up to 2 decimals)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="shsSchoolAddress">School Address</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="shsSchoolAddress" 
                      name="shsSchoolAddress"
                      value={formData.shsSchoolAddress}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('shsSchoolAddress')}
                      required 
                    />
                    <span className="focus-border"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* ENROLLMENT CHOICES SECTION */}
        <fieldset className={`form-section ${expandedSections.enrollment ? 'expanded' : 'collapsed'}`}>
          <legend 
            className="section-header"
            onClick={() => toggleSection('enrollment')}
            role="button"
            tabIndex="0"
          >
            <span className="section-icon">🎯</span>
            <span className="section-title">Enrollment Choices</span>
            <span className={`toggle-icon ${expandedSections.enrollment ? 'open' : ''}`}>▼</span>
          </legend>

          <div className={`section-content ${expandedSections.enrollment ? 'show' : ''}`}>
            <div className="radio-group">
              <label>Academic Level</label>
              <div className="radio-options">
                <div className="radio-item">
                  <input 
                    type="radio" 
                    id="undergraduate" 
                    name="academicLevel" 
                    value="Undergraduate"
                    checked={formData.academicLevel === 'Undergraduate'}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="undergraduate">
                    <span className="radio-label-text">Undergraduate</span>
                  </label>
                </div>
                <div className="radio-item">
                  <input 
                    type="radio" 
                    id="graduate" 
                    name="academicLevel" 
                    value="Graduate"
                    checked={formData.academicLevel === 'Graduate'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="graduate">
                    <span className="radio-label-text">Graduate</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="radio-group">
              <label>Semester</label>
              <div className="radio-options">
                <div className="radio-item">
                  <input 
                    type="radio" 
                    id="firstSem" 
                    name="semester" 
                    value="First Semester"
                    checked={formData.semester === 'First Semester'}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="firstSem">
                    <span className="radio-label-text">First Semester</span>
                  </label>
                </div>
                <div className="radio-item">
                  <input 
                    type="radio" 
                    id="secondSem" 
                    name="semester" 
                    value="Second Semester"
                    checked={formData.semester === 'Second Semester'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="secondSem">
                    <span className="radio-label-text">Second Semester</span>
                  </label>
                </div>
                <div className="radio-item">
                  <input 
                    type="radio" 
                    id="summer" 
                    name="semester" 
                    value="Summer"
                    checked={formData.semester === 'Summer'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="summer">
                    <span className="radio-label-text">Summer</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="radio-group">
              <label>Campus</label>
              <div className="radio-options">
                <div className="radio-item">
                  <input 
                    type="radio" 
                    id="manila" 
                    name="campus" 
                    value="Manila"
                    checked={formData.campus === 'Manila'}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="manila">
                    <span className="radio-label-text">Manila</span>
                  </label>
                </div>
                <div className="radio-item">
                  <input 
                    type="radio" 
                    id="quezoncity" 
                    name="campus" 
                    value="Quezon City"
                    checked={formData.campus === 'Quezon City'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="quezoncity">
                    <span className="radio-label-text">Quezon City</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="collegeDepartment">College Department</label>
                <div className="select-wrapper">
                  <select 
                    id="collegeDepartment" 
                    name="collegeDepartment"
                    value={formData.collegeDepartment}
                    onChange={handleInputChange}
                    disabled={!formData.academicLevel}
                    required
                  >
                    <option value="">-- Select College Department --</option>
                    {getFilteredDepartments().map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!formData.academicLevel && (
                  <small className="input-hint" style={{ color: '#ef4444' }}>
                    ⚠️ Select an Academic Level first
                  </small>
                )}
                {formData.academicLevel && (
                  <small className="input-hint">
                    Showing {formData.academicLevel} departments only
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="degreeProgram">Degree Program</label>
                <div className="select-wrapper">
                  <select 
                    id="degreeProgram" 
                    name="degreeProgram"
                    value={formData.degreeProgram}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.academicLevel}
                  >
                    <option value="">-- Select Degree Program --</option>
                    
                    {getFilteredDegreePrograms().map((optgroup) => (
                      <optgroup key={optgroup.category} label={optgroup.category}>
                        {optgroup.programs.map((program) => (
                          <option key={program} value={program}>
                            {program}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {!formData.academicLevel && (
                  <small className="input-hint" style={{ color: '#ef4444' }}>
                    ⚠️ Select an Academic Level first
                  </small>
                )}
                {formData.academicLevel && (
                  <small className="input-hint">
                    Showing {formData.academicLevel} programs only
                  </small>
                )}
              </div>
            </div>
          </div>
        </fieldset>

        {/* SUBMIT BUTTON */}
        <div className="button-group">
          <button type="submit" className="submit-btn">
            <span className="btn-icon">✓</span>
            Submit Registration
          </button>
          <button type="button" onClick={handleReset} className="reset-btn">
            <span className="btn-icon">↻</span>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
