import React, { useState, useMemo } from 'react';
import { SavingType, LoanStatus } from '../lib/types.js'; // Pastikan path benar
import { formatCurrency, formatDate } from '../lib/helpers.js'; // Pastikan path benar

const SavingsReport = ({ members, savings }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showOnlyArrears, setShowOnlyArrears] = useState(false);

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  const reportData = useMemo(() => {
    return members
      .map(member => {
        // --- LOGIKA BARU UNTUK MENANGANI TANGGAL & STATUS TUNGGAKAN ---
        const joinDate = new Date(member.joinDate?.toDate ? member.joinDate.toDate() : member.joinDate);
        if (isNaN(joinDate.getTime())) return { ...member, monthlyStatus: Array(12).fill('N/A'), hasArrears: false };

        const joinYear = joinDate.getFullYear();
        const joinMonth = joinDate.getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        const memberSavingsThisYear = savings.filter(s => 
            s.memberId === member.id && 
            s.type === SavingType.WAJIB &&
            new Date(s.date?.toDate ? s.date.toDate() : s.date).getFullYear() === selectedYear
        );

        const monthlyStatus = months.map(monthIndex => {
            // Abaikan bulan sebelum anggota bergabung pada tahun yang sama
            if (selectedYear === joinYear && monthIndex < joinMonth) {
                return 'N/A';
            }
            // Abaikan bulan jika tahun laporan sebelum tahun bergabung
            if (selectedYear < joinYear) {
                return 'N/A';
            }
            // Abaikan bulan di masa depan
            if (selectedYear === currentYear && monthIndex > currentMonth) {
                return 'Akan Datang';
            }

            const hasPaid = memberSavingsThisYear.some(s => new Date(s.date?.toDate ? s.date.toDate() : s.date).getMonth() === monthIndex);

            return hasPaid ? 'Lunas' : 'Nunggak';
        });
        // --- AKHIR LOGIKA BARU ---

        const hasArrears = monthlyStatus.includes('Nunggak');
        return { ...member, monthlyStatus, hasArrears, joinDate }; // Sertakan joinDate yang sudah di-parse
      })
      .sort((a,b) => a.name.localeCompare(b.name));
  }, [members, savings, selectedYear]);

  const filteredData = useMemo(() => {
    if (!showOnlyArrears) return reportData;
    return reportData.filter(d => d.hasArrears);
  }, [reportData, showOnlyArrears]);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Lunas': return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Lunas</span>;
      case 'Nunggak': return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Nunggak</span>;
      case 'Akan Datang': return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full">Akan Datang</span>;
      default: return <span className="text-xs text-gray-400">-</span>;
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="text-sm font-medium text-gray-700">Tahun:</label>
          <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="block w-full sm:w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="show-arrears" checked={showOnlyArrears} onChange={e => setShowOnlyArrears(e.target.checked)} className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
          <label htmlFor="show-arrears" className="ml-2 block text-sm text-gray-900">Tampilkan Penunggak Saja</label>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-48 min-w-[192px]">Nama Anggota</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-48 bg-gray-50 z-10 w-32 min-w-[128px]">Tgl. Bergabung</th>
              {months.map(month => (<th key={month} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">{new Date(0, month).toLocaleString('id-ID', { month: 'short' })}</th>))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? filteredData.map(data => (
              <tr key={data.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 w-48 min-w-[192px]">{data.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 sticky left-48 bg-white z-10 w-32 min-w-[128px]">{formatDate(data.joinDate)}</td>
                {data.monthlyStatus.map((status, index) => (<td key={index} className="px-2 py-3 whitespace-nowrap text-center text-sm w-24">{getStatusBadge(status)}</td>))}
              </tr>
            )) : (<tr><td colSpan={14} className="text-center py-10 text-gray-500">{showOnlyArrears ? 'Tidak ada anggota yang menunggak.' : 'Tidak ada data anggota.'}</td></tr>)}
          </tbody>
        </table>
      </div>
    </>
  );
};

const LoansReport = ({ members, loans, onViewLoanDetail }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const loansWithMemberNames = useMemo(() => {
        return loans.map(loan => {
            const member = members.find(m => m.id === loan.memberId);
            return { ...loan, memberName: member ? member.name : 'Anggota Tidak Ditemukan' };
        }).sort((a, b) => new Date(b.loanDate?.toDate ? b.loanDate.toDate() : b.loanDate).getTime() - new Date(a.loanDate?.toDate ? a.loanDate.toDate() : a.loanDate).getTime());
    }, [loans, members]);

    const filteredLoans = useMemo(() => {
        return loansWithMemberNames.filter(loan => {
            const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
            const matchesSearch = searchTerm === '' ||
                loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (loan.loanType && loan.loanType.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesStatus && matchesSearch;
        });
    }, [loansWithMemberNames, searchTerm, statusFilter]);

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <input 
                    type="text" 
                    placeholder="Cari nama anggota atau jenis pinjaman..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
                <div className="flex items-center gap-2">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Status:</label>
                    <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="block w-full sm:w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                        <option value="all">Semua</option>
                        <option value={LoanStatus.AKTIF}>Aktif</option>
                        <option value={LoanStatus.LUNAS}>Lunas</option>
                    </select>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Anggota</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl. Pinjam</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Pinjaman</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLoans.length > 0 ? filteredLoans.map(loan => (
                            <tr key={loan.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{loan.memberName}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(loan.loanDate)}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{loan.loanType}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{formatCurrency(loan.amount)}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center"><span className={`px-2 py-1 text-xs font-medium rounded-full ${loan.status === LoanStatus.AKTIF ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{loan.status}</span></td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center"><button onClick={() => onViewLoanDetail(loan.id)} className="text-red-600 hover:text-red-800 font-medium">Detail</button></td>
                            </tr>
                        )) : (<tr><td colSpan={6} className="text-center py-10 text-gray-500">{searchTerm || statusFilter !== 'all' ? 'Pinjaman tidak ditemukan.' : 'Belum ada riwayat pinjaman.'}</td></tr>)}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const ReportsPage = ({ members, savings, loans, onViewLoanDetail }) => {
  const [activeTab, setActiveTab] = useState('savings');

  const TabButton = ({ tab, label }) => (
    <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Laporan</h2>
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs"><TabButton tab="savings" label="Simpanan Wajib" /><TabButton tab="loans" label="Riwayat Pinjaman" /></nav>
        </div>
        {activeTab === 'savings' && <SavingsReport members={members} savings={savings} />}
        {activeTab === 'loans' && <LoansReport members={members} loans={loans} onViewLoanDetail={onViewLoanDetail} />}
      </div>
    </div>
  );
};

export default ReportsPage;