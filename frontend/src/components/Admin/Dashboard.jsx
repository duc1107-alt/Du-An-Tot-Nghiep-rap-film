import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Ticket, Film, Calendar, ArrowRight } from 'lucide-react';
import adminService from '../../services/admin.service';
import Loading from '../common/Loading';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await adminService.getDashboardStats();
        setStats(result.stats);
        setRecentBookings(result.recentBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  const cards = [
    {
      label: 'Total Revenue',
      value: `${stats?.totalRevenue?.toLocaleString()} VND`,
      icon: <TrendingUp size={24} className="text-emerald-500" />,
      bg: 'from-emerald-500/10 to-emerald-500/0 border-emerald-500/20',
    },
    {
      label: 'Active Users',
      value: stats?.totalUsers || 0,
      icon: <Users size={24} className="text-blue-500" />,
      bg: 'from-blue-500/10 to-blue-500/0 border-blue-500/20',
    },
    {
      label: 'Ticket Bookings',
      value: stats?.totalBookings || 0,
      icon: <Ticket size={24} className="text-brand" />,
      bg: 'from-brand/10 to-brand/0 border-brand/20',
    },
    {
      label: 'Movies Seeded',
      value: stats?.totalMovies || 0,
      icon: <Film size={24} className="text-purple-500" />,
      bg: 'from-purple-500/10 to-purple-500/0 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-dark-card border rounded-3xl p-6 flex items-center justify-between shadow-md bg-gradient-to-br ${card.bg}`}
          >
            <div className="space-y-1">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block">
                {card.label}
              </span>
              <span className="text-xl md:text-2xl font-black text-white block">{card.value}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl shrink-0">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Recent Bookings Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-md space-y-6">
        <div>
          <h3 className="text-lg font-black text-zinc-200">Recent Transactions</h3>
          <p className="text-xs text-zinc-500 mt-1">Real-time log of the latest tickets purchased by users.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-border text-zinc-500 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3 pl-4">User</th>
                <th className="pb-3">Movie</th>
                <th className="pb-3">Theater</th>
                <th className="pb-3">Seats</th>
                <th className="pb-3">Total Paid</th>
                <th className="pb-3 pr-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/40 text-xs font-semibold text-zinc-300">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-zinc-500 italic">
                    No transactions registered yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 pl-4">
                      <div className="font-bold text-zinc-200">{b.user?.username || 'Guest'}</div>
                      <div className="text-[10px] text-zinc-500">{b.user?.email || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 max-w-[200px] truncate">
                      {b.showtime?.movie?.title || 'Deleted Movie'}
                    </td>
                    <td className="py-3.5 truncate">
                      {b.showtime?.theater?.name || 'Deleted Theater'}
                    </td>
                    <td className="py-3.5">
                      <span className="bg-zinc-900 border border-dark-border px-2.5 py-1 rounded font-black text-brand text-[10px]">
                        {b.seats.join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 font-black text-zinc-200">
                      {b.totalPrice.toLocaleString()} VND
                    </td>
                    <td className="py-3.5 pr-4 text-right text-zinc-500 font-bold">
                      {new Date(b.bookingDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
