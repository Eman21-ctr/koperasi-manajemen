import React, { useMemo, useState } from 'react';
import { SavingType, LoanStatus } from '../lib/types.js';
import { formatCurrency, formatDate } from '../lib/helpers.js';
import { ArrowLeftIcon } from './Icons.jsx';
import EditMemberModal from './EditMemberModal.jsx';

// Komponen Tombol Tab (praktik terbaik adalah di luar komponen utama)
const TabButton = ({ tab, label, activeTab, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tab ? 'bg-white text-red-600 border-b-2 border-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
    >
      {label}
    </button>
);

const MemberDetail = ({ member, savings, loans, onBack, onUpdateMember }) => {
  const [activeTab, setActiveTab] = useState('savings');
  const [isEditing, setIsEditing] = useState(false);

  const totals = useMemo(() => {
    const totalPokok = savings.filter(s => s.type === SavingType.POKOK).reduce((sum, s) => sum + s.amount, 0);
    const totalWajib = savings.filter(s => s.type === SavingType.WAJIB).reduce((sum, s) => sum + s.amount, 0);
    const totalSukarela = savings.filter(s => s.type === SavingType.SUKARELA).reduce((sum, s) => sum + s.amount, 0);
    const totalOverall = totalPokok + totalWajib + totalSukarela;
    return { totalPokok, totalWajib, totalSukarela, totalOverall };
  }, [savings]);

  const savingsHistory = useMemo(() => {
    return [...savings].sort((a, b) => new Date(b.date?.toDate ? b.date.toDate() : b.date).getTime() - new Date(a.date?.toDate ? a.date.toDate() : a.date).getTime());
  }, [savings]);
  
  const loansHistory = useMemo(() => {
    return [...loans].sort((a, b) => new Date(b.loanDate?.toDate ? b.loanDate.toDate() : b.loanDate).getTime() - new Date(a.loanDate?.toDate ? a.loanDate.toDate() : a.loanDate).getTime());
  }, [loans]);
  
  if (!member) {
      return <div>Memuat data anggota...</div>;
  }

  return (
    // Satu Fragment pembungkus untuk seluruh komponen
    <>
      {isEditing && (
          <EditMemberModal 
              member={member} 
              onClose={() => setIsEditing(false)} 
              onUpdate={onUpdateMember} 
          />
      )}

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-4">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="w-5 h-5" />
            Kembali ke Daftar Anggota
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Info & Ringkasan */}
          <div className="lg:col-span-1 space-y-6">
              {/* Kartu Info Anggota */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                      <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-blue-600 hover:underline">Edit Profil</button>
                  </div>
                  <p className="text-sm text-gray-500">No. Anggota: {member.id}</p>
                  <div className="border-t my-4"></div>
                  <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="font-medium text-gray-600">No. KTP:</span><span>{member.idNumber}</span></div>
                      <div className="flex justify-between"><span className="font-medium text-gray-600">TTL:</span><span>{member.pob}, {formatDate(member.dob)}</span></div>
                      <div className="flex justify-between"><span className="font-medium text-gray-600">Jenis Kelamin:</span><span>{member.gender}</span></div>
                      <div className="flex justify-between"><span className="font-medium text-gray-600">Pekerjaan:</span><span>{member.occupation}</span></div>
                      <div className="flex justify-between"><span className="font-medium text-gray-600">No. Telepon:</span><span>{member.phone}</span></div>
                      <div className="flex justify-between"><span className="font-medium text-gray-600">Alamat:</span><span className="text-right">{member.address}</span></div>
                      <div className="flex justify-between"><span className="font-medium text-gray-600">Tgl. Gabung:</span><span>{formatDate(member.joinDate)}</span></div>
                      <div className="border-t my-2"></div>
                      <div className="flex justify-between"><span className="font-medium text-gray-600">Ahli Waris:</span><span>{member.heirName} ({member.heirRelationship})</span></div>
                  </div>
              </div>

              {/* Kartu Ringkasan Saldo */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Saldo</h4>
                  <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center"><span className="text-gray-600">{SavingType.POKOK}</span><span className="font-medium">{formatCurrency(totals.totalPokok)}</span></div>
                      <div className="flex justify-between items-center"><span className="text-gray-600">{SavingType.WAJIB}</span><span className="font-medium">{formatCurrency(totals.totalWajib)}</span></div>
                      <div className="flex justify-between items-center"><span className="text-gray-600">{SavingType.SUKARELA}</span><span className="font-medium">{formatCurrency(totals.totalSukarela)}</span></div>
                      <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-base"><span>Total Simpanan</span><span className="text-red-600">{formatCurrency(totals.totalOverall)}</span></div>
                  </div>
              </div>
          </div>

          {/* Kolom Kanan: Riwayat (Tab) */}
          <div className="lg:col-span-2">
              <div className="flex border-b border-gray-200">
                  <TabButton tab="savings" label="Riwayat Simpanan" activeTab={activeTab} setActiveTab={setActiveTab} />
                  <TabButton tab="loans" label="Riwayat Pinjaman" activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
              <div className="bg-white p-6 rounded-b-lg shadow-md">
                  {activeTab === 'savings' && (
                    <div className="overflow-x-auto max-h-[600px]">
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th></tr></thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {savingsHistory.length > 0 ? savingsHistory.map(saving => (
                                  <tr key={saving.id}><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(saving.date)}</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{saving.type}</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{formatCurrency(saving.amount)}</td></tr>
                              )) : (<tr><td colSpan={3} className="text-center py-10 text-gray-500">Belum ada riwayat simpanan.</td></tr>)}
                          </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === 'loans' && (
                     <div className="overflow-x-auto max-h-[600px]">
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jenis Pinjaman</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th><th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {loansHistory.length > 0 ? loansHistory.map(loan => (
                                  <tr key={loan.id}><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(loan.loanDate)}</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{loan.loanType}</td><td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{formatCurrency(loan.amount)}</td><td className="px-4 py-3 whitespace-nowrap text-sm text-center"><span className={`px-2 py-1 text-xs font-medium rounded-full ${loan.status === LoanStatus.AKTIF ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{loan.status}</span></td></tr>
                              )) : (<tr><td colSpan={4} className="text-center py-10 text-gray-500">Belum ada riwayat pinjaman.</td></tr>)}
                          </tbody>
                      </table>
                    </div>
                  )}
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDetail;