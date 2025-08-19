import React, { useMemo } from 'react';
import { SavingType, LoanStatus } from '../lib/types.js'; // Pastikan path benar
import { formatCurrency } from '../lib/helpers.js'; // Impor dari helpers.js
import { UsersIcon, WalletIcon, CreditCardIcon } from './Icons.jsx'; // Pastikan path benar

// Komponen StatCard sudah bersih
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="p-3 bg-red-100 rounded-full text-red-600">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// Komponen Dashboard sudah bersih
const Dashboard = ({ members, savings, loans }) => {

  const stats = useMemo(() => {
    const totalPokok = savings.filter(s => s.type === SavingType.POKOK).reduce((sum, s) => sum + s.amount, 0);
    const totalWajib = savings.filter(s => s.type === SavingType.WAJIB).reduce((sum, s) => sum + s.amount, 0);
    const totalSukarela = savings.filter(s => s.type === SavingType.SUKARELA).reduce((sum, s) => sum + s.amount, 0);
    const totalOverall = totalPokok + totalWajib + totalSukarela;
    
    const totalOutstandingLoans = loans.filter(l => l.status === LoanStatus.AKTIF).reduce((sum, l) => sum + l.amount, 0);

    return {
      totalMembers: members.length,
      totalOverall: formatCurrency(totalOverall),
      totalPokok: formatCurrency(totalPokok),
      totalWajib: formatCurrency(totalWajib),
      totalSukarela: formatCurrency(totalSukarela),
      totalOutstandingLoans: formatCurrency(totalOutstandingLoans),
    }
  }, [members, savings, loans]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Anggota" value={stats.totalMembers} icon={<UsersIcon className="w-6 h-6"/>} />
            <StatCard title="Total Saldo Simpanan" value={stats.totalOverall} icon={<WalletIcon className="w-6 h-6"/>} />
            <StatCard title="Total Pinjaman Beredar" value={stats.totalOutstandingLoans} icon={<CreditCardIcon className="w-6 h-6"/>} />
            <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium text-gray-600 mb-3">Rincian Simpanan</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">{SavingType.POKOK}</span><span className="font-semibold">{stats.totalPokok}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{SavingType.WAJIB}</span><span className="font-semibold">{stats.totalWajib}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{SavingType.SUKARELA}</span><span className="font-semibold">{stats.totalSukarela}</span></div>
                </div>
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;