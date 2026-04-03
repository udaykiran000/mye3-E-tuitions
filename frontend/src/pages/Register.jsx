import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import registerBg from '../assets/register img.png';
import logoImg from '../assets/output-onlinepngtools.png';

const Register = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('Student');
  const [syllabus, setSyllabus] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError]       = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const { data } = await axios.get('/student/catalog');
        // Extract unique class names/levels from both bundles and subjects
        // We want to show "Class 6", "Class 11", etc.
        const classes = data.map(item => item.className);
        const uniqueClasses = [...new Set(classes)].filter(Boolean).sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.replace(/\D/g, '')) || 0;
          return numA - numB;
        });
        setAvailableClasses(uniqueClasses);
      } catch (err) {
        console.error('Failed to fetch classes for registration', err);
      }
    };
    fetchCatalog();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res  = await axios.post('/auth/register', { name, email, password, role, syllabus, className });
      const user = res.data;
      dispatch(setCredentials({ ...user }));
      if (user.role.toLowerCase() === 'admin')        navigate('/admin/dashboard');
      else if (user.role.toLowerCase() === 'teacher') navigate('/teacher/dashboard');
      else                                             navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <style>{`
        /* ── Reset ── */
        html, body, #root {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden;
        }
        * { box-sizing: border-box; }

        /* ── Page shell: dual background ── */
        .reg-page {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #f0f2f5;        /* light gray overall */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 1;
        }

        /* ── Right background block ── */
        .reg-bg-sync {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: -1;
        }
        .reg-bg-sync-red {
          position: relative;
          width: 85%;
          max-width: 1150px;
          height: 100vh;
        }
        .reg-bg-sync-red::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 60%;
          right: -100vw;
          background: #002855;   /* Slightly more vibrant Navy Blue */
        }

        /* ── The Central Card ── */
        .reg-main-card {
          position: relative;
          display: flex;
          width: 85%;
          max-width: 1150px;
          height: 82vh;
          min-height: 550px;
          border-radius: 12px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.3); /* Big drop shadow */
          overflow: hidden; /* Rounds the inner corners */
          z-index: 10;
        }

        /* ── Image section (Left) ── */
        .reg-card-left {
          position: relative;
          width: 60%;
          height: 100%;
          background: #002855; 
        }

        .reg-left-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover; /* Back to cover as requested "sides ki em vadhu" */
          object-position: center;
          display: block;
        }

        /* No dark overlay needed since the new image has perfect baked-in lighting and white text */
        .reg-left-overlay {
          display: none;
        }

        .reg-form-logo {
          display: block;
          height: 140px; /* Increased logo size as requested */
          margin: 0 auto 10px auto;
          object-fit: contain;
        }

        /* ── Form section (Right) ── */
        .reg-card-right {
          position: relative;
          width: 40%;
          height: 100%;
          background: #002855;
          display: flex;
          flex-direction: column;
          overflow: hidden; /* No scrolling */
        }

        /* Inner container - compacted */
        .reg-form-inner {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 40px; 
        }

        /* ── Form content ── */
        .reg-form-box {
          width: 100%;
          max-width: 300px;
          color: #fff;
        }
        .reg-form-box h2 {
          font-size: 28px; /* Smaller title */
          font-weight: 400;
          line-height: 1.1;
          margin: 0 0 5px 0;
          text-align: center;
        }
        .reg-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.82);
          line-height: 1.5;
          margin: 0 0 20px 0;
          text-align: center;
        }

        /* error */
        .reg-error {
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 5px;
          padding: 10px 12px;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 18px;
        }

        /* input rows */
        .reg-field {
          border-bottom: 1px solid rgba(255,255,255,0.40);
          margin-bottom: 15px; /* Tighter spacing */
          display: flex;
          align-items: center;
        }
        .reg-input {
          flex: 1;
          background: transparent !important;
          border: none;
          outline: none;
          color: #fff !important;
          font-size: 14px;
          padding: 8px 0;
          -webkit-text-fill-color: #fff !important;
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.52); }
        .reg-input:-webkit-autofill,
        .reg-input:-webkit-autofill:hover,
        .reg-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #002855 inset !important;
          -webkit-text-fill-color: #fff !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        .reg-select {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          padding: 8px 0;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          color-scheme: dark;
        }
        .reg-select option { background: #002855; color: #fff; }

        /* terms */
        .reg-terms {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 18px;
        }
        .reg-terms input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: #e84c3d;
          cursor: pointer;
          flex-shrink: 0;
        }
        .reg-terms label {
          font-size: 11px;
          color: rgba(255,255,255,0.88);
          cursor: pointer;
          line-height: 1.5;
        }
        .reg-terms label span {
          font-weight: 700;
          text-decoration: underline;
        }

        /* register button */
        .reg-btn {
          width: 100%;
          padding: 14px;
          background: #e84c3d;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .reg-btn:hover  { background: #e65100; } /* More orange hover */
        .reg-btn:active { transform: scale(0.98); }

        /* login link */
        .reg-login-link {
          text-align: center;
          margin-top: 22px;
        }
        .reg-login-link p {
          font-size: 11px;
          color: rgba(255,255,255,0.78);
          margin: 0 0 3px 0;
        }
        .reg-login-link a {
          color: #fff;
          font-weight: 700;
          text-decoration: underline;
        }

        /* ── Mobile responsiveness ── */

        @media (max-width: 900px) {
          .reg-page {
            height: 100vh;
            min-height: 100vh;
            padding: 15px;
            align-items: center;
          }
          .reg-bg-sync {
            display: none; /* Hide background split in mobile */
          }
          .reg-main-card {
            width: 100%;
            max-width: 500px;
            height: auto;
            min-height: auto;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          }
          .reg-card-left {
            display: none; /* Hide image entirely on mobile */
          }
          .reg-card-right {
            width: 100%;
            border-radius: 16px;
            padding: 0;
            justify-content: center;
          }
          .reg-form-inner {
            padding: 40px 25px;
          }
          .reg-form-box {
            max-width: 100%;
          }
          .reg-form-logo {
            height: 95px;
            margin: 0 auto 16px auto;
          }
          
          /* ── Compact UI elements for 540px height screens ── */
          .reg-form-box h2 {
            font-size: 24px;   /* Smaller headline */
            margin-bottom: 12px;
            line-height: 1.15;
            text-align: center; /* centering heading looks good here */
          }
          .reg-subtitle {
            display: none; /* Hide getting started text entirely on mobile */
          }
          .reg-error {
            padding: 6px 10px;
            margin-bottom: 10px;
          }
          .reg-field {
            margin-bottom: 12px; /* Tighter input spacing */
          }
          .reg-input, .reg-select {
            font-size: 13px;
            padding: 5px 0;
          }
          .reg-terms {
            margin-bottom: 14px;
            gap: 6px;
          }
          .reg-terms label {
            font-size: 10px;
          }
          .reg-btn {
            padding: 10px;       /* Smaller button */
            font-size: 11px;
          }
          .reg-login-link {
            margin-top: 12px;
          }
          .reg-login-link p {
            margin: 0;
            line-height: 1.4;
          }
        }
      `}</style>

      {/* ════════════════════════════════════════════
          PAGE SHELL  —  dual background with centered card
      ════════════════════════════════════════════ */}
      <div className="reg-page">
        {/* The red background right block — EXACTLY synced with the card split */}
        <div className="reg-bg-sync">
          <div className="reg-bg-sync-red" />
        </div>

        {/* ── THE CENTRAL CARD ── */}
        <div className="reg-main-card">
          
          {/* Left section: Dark Image */}
          <div className="reg-card-left">
            <img
              src={registerBg}
              alt="Student giving thumbs up"
              className="reg-left-img"
            />
            <div className="reg-left-overlay" />
            
          </div>

          {/* Right section: Navy Blue Form */}
          <div className="reg-card-right">
            <div className="reg-form-inner">
              <div className="reg-form-box">

                {/* Form Logo */}
                <img src={logoImg} alt="e-Tuitions Logo" className="reg-form-logo" />

                {/* Header */}
                <h2>Let's Get<br />You Started</h2>

                {/* Error */}
                {error && <div className="reg-error">{error}</div>}

                {/* Form */}
                <form onSubmit={submitHandler}>

                  {/* Full Name */}
                  <div className="reg-field">
                    <input
                      type="text"
                      className="reg-input"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="reg-field">
                    <input
                      type="email"
                      className="reg-input"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="reg-field">
                    <input
                      type="password"
                      className="reg-input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Syllabus */}
                  <div className="reg-field">
                    <select
                      className="reg-select"
                      value={syllabus}
                      onChange={(e) => setSyllabus(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Syllabus</option>
                      <option value="CBSE">CBSE Syllabus</option>
                      <option value="ICSE">ICSE Syllabus</option>
                    </select>
                  </div>

                  {/* Class Name */}
                  <div className="reg-field">
                    <select
                      className="reg-select"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Class</option>
                      {availableClasses.map((cls, idx) => (
                        <option key={idx} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  {/* Terms */}
                  <div className="reg-terms">
                    <input
                      type="checkbox"
                      id="reg-terms-chk"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <label htmlFor="reg-terms-chk">
                      I agree to <span>Terms &amp; Conditions</span>
                    </label>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="reg-btn">
                    Register
                  </button>
                </form>

                {/* Login link */}
                <div className="reg-login-link">
                  <p>Already have an account?</p>
                  <p>Click <Link to="/login">here</Link> to login</p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Register;
