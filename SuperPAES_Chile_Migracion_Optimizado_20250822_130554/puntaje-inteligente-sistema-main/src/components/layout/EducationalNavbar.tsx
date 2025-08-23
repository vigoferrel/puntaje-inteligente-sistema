/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Link } from 'react-router-dom';
export const EducationalNavbar = () => {
  const navItems = [
    { path: '/neural', label: 'Neural', icon: 'Brain' },
    { path: '/spotify', label: 'Spotify', icon: 'Music' },
    { path: '/bloom', label: 'Bloom', icon: 'Flower' },
    { path: '/paes', label: 'PAES', icon: 'Book' },
    { path: '/diagnostic', label: 'Diagnostico', icon: 'Search' },
    { path: '/visual', label: 'Visual', icon: 'Eye' },
    { path: '/gamification', label: 'Juegos', icon: 'Game' }
  ];
  return (
    <nav style={{padding: '1rem', backgroundColor: '#1a1a2e'}}>
      {navItems.map(item => (
        <Link key={item.path} to={item.path} style={{margin: '0 1rem', color: 'white'}}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

