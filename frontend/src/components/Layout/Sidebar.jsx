import React from 'react';
import {
  LayoutDashboard,
  Film,
  CalendarDays,
  DoorOpen,
  Apple,
  TrendingUp,
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'movies', label: 'Movie Manager', icon: <Film size={18} /> },
    { id: 'showtimes', label: 'Showtimes', icon: <CalendarDays size={18} /> },
    { id: 'rooms', label: 'Room Manager', icon: <DoorOpen size={18} /> },
    { id: 'revenue', label: 'Revenue Report', icon: <TrendingUp size={18} /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-dark-card border-r border-dark-border py-8 px-4 shrink-0 flex flex-col gap-6">
      <div className="px-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Admin Control</h2>
      </div>

      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-brand text-white shadow-[0_4px_14px_rgba(229,9,20,0.35)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
