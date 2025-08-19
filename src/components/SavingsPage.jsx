import React, { useState, useMemo } from 'react';
import { SavingType } from '../lib/types.js'; // Pastikan path ini benar
import { formatCurrency, formatDate } from '../lib/helpers.js'; // Pastikan path ini benar

const AddDepositForm = ({ member, onAddSaving }) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState(SavingType.WAJIB);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const handleAmountChange = (e) => {
        // Hanya izinkan angka
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (amount === '' || Number(amount) <= 0) {
            alert('Jumlah setoran tidak valid.');
            return;
        }

        const numericAmount = Number(amount);
        const transactionDate = new Date();
        const savingDate = type === SavingType.WAJIB ? new Date(year, month, 1) : transactionDate;

        const newSaving = {
            id: crypto.randomUUID(),
            memberId: member.id,
            date: savingDate,
            type,
            amount: numericAmount,
        };
        
        const receipt = {
            memberName: member.name,
            date: transactionDate,
            items: [{ 
                description: `${type} ${type === SavingType.WAJIB ? `(${savingDate.toLocaleString('id-ID', {month: 'long', year: 'numeric'})})` : ''}`, 
                amount: numericAmount 
            }],
            total: numericAmount,
        };
        
        onAddSaving(newSaving, receipt);
        setAmount('');
        alert(`Setoran ${type} untuk ${member.name} berhasil ditambahkan.`);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
             <h3 className="text-xl font-bold text-gray-800">Tambah Setoran untuk {member.name}</h3>
             <div>
                 <label className="text-sm font-medium text-gray-700">Jenis Setoran</label>
                 <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                     <option value={SavingType.WAJIB}>Simpanan Wajib</option>
                     <option value={SavingType.SUKARELA}>Simpanan Sukarela</option>
                 </select>
             </div>
             {type === SavingType.WAJIB && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Bulan</label>
                        <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                            {Array.from({length: 12}).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('id-ID', {month: 'long'})}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tahun</label>
                        <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                    </div>
                </div>
             )}
              <div>
                 <label className="text-sm font-medium text-gray-700">Jumlah</label>
                 <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
                    <input type="text" value={amount === '' ? '' : Number(amount).toLocaleString('id-ID')} onChange={handleAmountChange} placeholder="0" className="pl-8 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                 </div>
             </div>
             <button type="submit" className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">Simpan Setoran</button>
        </form>
    );
};


const SavingsPage = ({ members, savings, onAddSaving }) => {
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = useMemo(() => {
        if (!searchTerm) return members;
        return members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [members, searchTerm]);

    const selectedMember = members.find(m => m.id === selectedMemberId);

    const memberTotals = useMemo(() => {
        if (!selectedMember) return null;
        const memberSavings = savings.filter(s => s.memberId === selectedMember.id);
        const totals = memberSavings.reduce((acc, s) => {
            if (!acc[s.type]) acc[s.type] = 0;
            acc[s.type] += s.amount;
            return acc;
        }, {}); // Hapus 'as Record<...>'
        const totalSavings = Object.values(totals).reduce((sum, amount) => sum + amount, 0);
        return { ...totals, total: totalSavings };
    }, [selectedMember, savings]);

    return (
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaksi Simpanan Anggota</h2>
                
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <label htmlFor="member-search" className="block text-sm font-medium text-gray-700 mb-2">Pilih Anggota</label>
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            placeholder="Cari nama anggota..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedMemberId('');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                        <select 
                            id="member-search" 
                            value={selectedMemberId} 
                            onChange={(e) => setSelectedMemberId(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        >
                            <option value="">-- Pilih Anggota --</option>
                            {filteredMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name} (ID: {member.id})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedMember && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold text-gray-800">Ringkasan Saldo: {selectedMember.name}</h3>
                            {memberTotals && (
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">{SavingType.POKOK}</span>
                                        <span className="font-medium">{formatCurrency(memberTotals[SavingType.POKOK] || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">{SavingType.WAJIB}</span>
                                        <span className="font-medium">{formatCurrency(memberTotals[SavingType.WAJIB] || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">{SavingType.SUKARELA}</span>
                                        <span className="font-medium">{formatCurrency(memberTotals[SavingType.SUKARELA] || 0)}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-base">
                                        <span>Total</span>
                                        <span className="text-red-600">{formatCurrency(memberTotals.total)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <AddDepositForm member={selectedMember} onAddSaving={onAddSaving} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavingsPage;