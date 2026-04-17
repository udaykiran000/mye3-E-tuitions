# 🚀 Live Class System & Teacher Payroll - End-to-End Plan

This document provides a clear, detailed overview of the entire project to implement advanced life class scheduling and a professional teacher payroll system.

---

## 📅 Part 1: Advanced Live Class Management

### 1.1 Scheduling with End-Times
- **Current:** Only has a start time.
- **New:** Every class will have an **End Time**. 
- **Control:** The "Join" or "Start" buttons will automatically disappear exactly when the class time is up. This prevents students or teachers from entering old links.

### 1.2 Multi-Week Navigation
- **View:** The Admin and Teacher dashboards will show a 7-day timetable.
- **Navigation:** I will add **"Next Week"** and **"Previous Week"** buttons. This allows the Admin to schedule classes for the entire month ahead of time.
- **Recurring Classes:** You can select a class slot and "Repeat it for 4 weeks" to quickly fill the calendar.

### 1.3 Conflict Prevention (No Double Booking)
The system will automatically block scheduling if:
1.  **Teacher Conflict:** A teacher is already teaching another class during that time.
2.  **Classroom Conflict:** The same Class Level (e.g., 6th Class) already has a session during that time.

---

## 💰 Part 2: Teacher Payroll System

### 2.1 Automated Session Tracking
- Every teacher's payout is calculated only from classes marked as **"Ended"**. 
- If a class is scheduled but the teacher doesn't take it, it won't be counted for pay.

### 2.2 Teacher-Specific Pricing
Each teacher will have their own rates saved in their profile:
- **Rate A:** For Classes 6 to 10.
- **Rate B:** For Inter 1st & 2nd Year.
*Example: Teacher Ravi might get ₹500 for Class 10, while Teacher Kiran might get ₹600.*

### 2.3 Monthly Payouts
- **Calculations:** Always from the **1st to the end of the month**.
- **Admin View:** A clear table showing: 
    - `Teacher Name` | `Total Completed Classes` | `Total Amount` | `Status (Paid/Pending)`
- **Teacher View:** Each teacher sees their own "Earnings" dashboard so there is 100% transparency.

### 2.4 Payment Confirmation
When the Admin pays the teacher outside the app (e.g., PhonePe, GPay, Bank Transfer):
1.  Admin enters the **Transaction ID** into the system.
2.  Admin marks it as **"Paid"**.
3.  The status updates instantly for the Teacher to see.

---

## ⚡ Part 3: Real-Time Experience (Socket.io)

No one needs to refresh their browser anymore:
- When a Teacher clicks **"Go Live"**, the **"Join Now"** button appears instantly on the Student's screen.
- When an Admin adds or deletes a class, it updates on the Teacher's screen instantly.

---

## 🛠️ Technical Breakdown (The "Under the Hood" Stuff)

- **Database:** 
    - Update `User` model for `payRates`.
    - Update `LiveSession` model for `endTime`.
    - New `Payout` model for monthly tracking.
- **Backend:** 
    - New routes for `/admin/payroll` and `/teacher/earnings`.
    - Improved validation for scheduling overlaps.
- **Frontend:** 
    - New `TeacherPayroll.jsx` (Admin).
    - New `MyEarnings.jsx` (Teacher).
    - Updated `LiveMonitor.jsx` with navigation & end-times.

---

## ✅ Phase-by-Phase Execution
1.  **Phase 1:** Update Database & Backend validation (End times + Conflicts).
2.  **Phase 2:** Implement Real-time updates (Socket.io) in Student/Teacher pages.
3.  **Phase 3:** Build the UI for Multi-week navigation and End-time selection.
4.  **Phase 4:** Build the Teacher Payroll system (Calculation + Admin/Teacher views).
5.  **Phase 5:** Final Testing & Verification.

---

> [!NOTE]
> This plan has been created and approved for implementation.
