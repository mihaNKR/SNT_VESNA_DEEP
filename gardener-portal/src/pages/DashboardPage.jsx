import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import MemberInfo from '../components/Dashboard/MemberInfo';
import Payments from '../components/Dashboard/Payments';
import Meetings from '../components/Dashboard/Meetings';
import Documents from '../components/Dashboard/Documents';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<MemberInfo />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;
