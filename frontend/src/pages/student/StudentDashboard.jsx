import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Overview from './Overview';
import Assignments from '../Assignments';
import Attendance from '../Attendance';
import Fees from '../Fees';
import Profile from '../Profile';

const StudentDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default StudentDashboard;
