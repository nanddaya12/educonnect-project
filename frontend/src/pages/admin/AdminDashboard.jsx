import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Overview from '../trainer/Overview';
import FacultyManagement from './FacultyManagement';
import StudentsList from '../trainer/StudentsList';
import Assignments from '../Assignments';
import Attendance from '../Attendance';
import Fees from '../Fees';
import Profile from '../Profile';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/trainers" element={<FacultyManagement />} />
      <Route path="/students" element={<StudentsList />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AdminDashboard;
