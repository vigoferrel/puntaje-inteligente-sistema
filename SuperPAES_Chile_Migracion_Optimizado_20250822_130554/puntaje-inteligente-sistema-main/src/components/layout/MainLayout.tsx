/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { EducationalNavbar } from './EducationalNavbar';
export const MainLayout = () => {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0f0f23'}}>
      <EducationalNavbar />
      <main style={{padding: '2rem'}}>
        <Outlet />
      </main>
    </div>
  );
};

