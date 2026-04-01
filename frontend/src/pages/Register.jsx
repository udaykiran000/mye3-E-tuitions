import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import registerBg from '../assets/ChatGPT Image Mar 30, 2026, 04_09_31 AM.png';
import logoGif from '../assets/logo_transparent.gif';

const Register = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('Student');
  const [error, setError]       = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res  = await axios.post('/auth/register', { name, email, password, role });
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
          left: 62%;             /* Exactly matches .reg-card-left's width */
          right: -100vw;         /* Bleed massively off the right side */
          background: #e84c3d;   /* The exact same red background */
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
          width: 62%;
          height: 100%;
          background: #0b1320;
        }

        .reg-left-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 55% 10%;   /* show face + upper body + thumbs */
          display: block;
        }

        /* No dark overlay needed since the new image has perfect baked-in lighting and white text */
        .reg-left-overlay {
          display: none;
        }

        /* ── Logo over image ── */
        .reg-logo {
          position: absolute;
          top: 6%;             /* Positioned above the girl's head */
          right: 22%;          /* Adjust horizontal position to sit over her head */
          left: auto;          /* Reset left so right takes over */
          height: 150px;       /* Made it slightly bigger as requested */
          width: auto;
          z-index: 10;
        }

        /* ── Form section (Right) ── */
        .reg-card-right {
          position: relative;
          width: 38%;
          height: 100%;
          background: #e84c3d;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 44px;
          overflow-y: auto;
        }

        /* ── Form content ── */
        .reg-form-box {
          width: 100%;
          max-width: 300px;
          color: #fff;
        }
        .reg-form-box h2 {
          font-size: 34px;
          font-weight: 400;
          line-height: 1.22;
          margin: 0 0 8px 0;
        }
        .reg-subtitle {
          font-size: 12px;
          color: rgba(255,255,255,0.82);
          line-height: 1.75;
          margin: 0 0 30px 0;
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
          margin-bottom: 20px;
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
          -webkit-box-shadow: 0 0 0 1000px #e84c3d inset !important;
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
        .reg-select option { background: #e84c3d; color: #fff; }

        /* terms */
        .reg-terms {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
        }
        .reg-terms input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: #0b1320;
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
          background: #0b1320;
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
        .reg-btn:hover  { background: #060d18; }
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
        .reg-mobile-logo {
          display: none;
          height: 95px;
          margin: 0 auto 25px auto;
        }

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
            border-radius: 16px; /* Round all corners for the solo card */
            padding: 20px 25px;   /* Significantly reduced vertical padding */
            justify-content: center;
          }
          .reg-form-box {
            max-width: 100%;
          }
          .reg-mobile-logo {
            display: block; /* Show logo above form on mobile */
            height: 95px;   /* Increased logo size as requested */
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
            
            {/* Logo perfectly positioned above the girl's head */}
            <img src={logoGif} alt="e-Tuitions Logo" className="reg-logo" />
          </div>

          {/* Right section: Coral-red Form */}
          <div className="reg-card-right">
            <div className="reg-form-box">

            {/* Mobile Logo */}
            <img src={logoGif} alt="e-Tuitions Logo" className="reg-mobile-logo" />

            {/* Header */}
            <h2>Let's Get<br />You Started</h2>
            <p className="reg-subtitle">
              Getting started is quick and simple,<br />just fill out the form below
            </p>

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

              {/* Role */}
              <div className="reg-field">
                <select
                  className="reg-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
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
    </>
  );
};

export default Register;
