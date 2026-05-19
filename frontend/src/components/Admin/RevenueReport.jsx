import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, Landmark, BarChart3 } from 'lucide-react';
import adminService from '../../services/admin.service';
import Loading from '../common/Loading';

export const RevenueReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const result = await adminService.getRevenueReport();
        setReport(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) return <Loading />;

  const COLORS = ['#e50914', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const monthlyData = report?.monthlySales || [];
  const movieData = report?.movieSales || [];
  const theaterData = report?.theaterSales || [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black text-zinc-200">Financial Reports & Insights</h3>
        <p className="text-xs text-zinc-500 mt-1">Review complex sales performances, monthly ticket flows, and top popular films.</p>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Monthly Revenue Chart */}
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-sm">
          <h4 className="font-bold text-zinc-300 text-sm flex items-center gap-2">
            <DollarSign size={16} className="text-brand" /> Monthly Booking Revenue
          </h4>
          <div className="h-72 w-full pt-4">
            {monthlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 italic text-xs">
                No monthly sales aggregates registered.
              </div>
            ) : (
              <ResponsiveContainer width="100%" h="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis dataKey="name" stroke="#9fa0a6" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9fa0a6" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16161e', borderColor: '#2a2a35', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="#e50914" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Theater venues Sales Chart */}
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-sm">
          <h4 className="font-bold text-zinc-300 text-sm flex items-center gap-2">
            <Landmark size={16} className="text-blue-500" /> Complex Venues Performance
          </h4>
          <div className="h-72 w-full pt-4">
            {theaterData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 italic text-xs">
                No theater sales comparisons registered.
              </div>
            ) : (
              <ResponsiveContainer width="100%" h="100%">
                <BarChart data={theaterData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis type="number" stroke="#9fa0a6" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#9fa0a6" fontSize={10} tickWidth={100} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#16161e', borderColor: '#2a2a35', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Movie Proportion Chart */}
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-sm lg:col-span-2">
          <h4 className="font-bold text-zinc-300 text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-emerald-500" /> Movie Sales Proportions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
            <div className="h-64 w-full">
              {movieData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500 italic text-xs">
                  No movie proportions tracked.
                </div>
              ) : (
                <ResponsiveContainer width="100%" h="100%">
                  <PieChart>
                    <Pie data={movieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {movieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#16161e', borderColor: '#2a2a35', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* List custom Legend color keys */}
            <div className="space-y-3">
              <h5 className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Top Performing Movies</h5>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {movieData.length === 0 ? (
                  <p className="text-xs text-zinc-600 italic">No movie data tracked.</p>
                ) : (
                  movieData.map((item, idx) => (
                    <div key={item.name} className="flex justify-between items-center text-xs font-semibold">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-zinc-300 truncate max-w-[150px]">{item.name}</span>
                      </div>
                      <span className="text-zinc-500">{item.value.toLocaleString()} VND</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
