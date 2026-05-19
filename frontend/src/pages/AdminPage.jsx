import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/Layout/Sidebar';
import Dashboard from '../components/Admin/Dashboard';
import MovieManager from '../components/Admin/MovieManager';
import ShowtimeManager from '../components/Admin/ShowtimeManager';
import RoomManager from '../components/Admin/RoomManager';
import RevenueReport from '../components/Admin/RevenueReport';

export const AdminPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Lock page access behind admin authentication check
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent('/admin'));
    } else if (!isAdmin) {
      alert('Access Denied: You do not have administration privileges.');
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'movies':
        return <MovieManager />;
      case 'showtimes':
        return <ShowtimeManager />;
      case 'rooms':
        return <RoomManager />;
      case 'revenue':
        return <RevenueReport />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row bg-dark-deep rounded-3xl overflow-hidden border border-dark-border min-h-[75vh] shadow-2xl">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Console view panels */}
        <main className="flex-1 p-6 md:p-8 bg-[#0c0c0e] overflow-y-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
