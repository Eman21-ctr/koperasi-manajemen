import React, { useState, useMemo, useEffect } from 'react';
import { LoanStatus } from '../lib/types';
import { formatCurrency, formatDate, exportToExcel } from '../lib/helpers.js';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const LoansPage = ({ members, onAddLoan }) => {
    const [selectedMemberId, setSelectedMemberId] = useState('');
    
    // Form state
     const [amount, setAmount] = useState('');
    const [loanType, setLoanType] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [term, setTerm] = useState('');
    const [loanDate, setLoanDate] = useState(getTodayDateString());

    const [simulation, setSimulation] = useState([]);

    useEffect(() => {
        if (typeof amount === 'number' && amount > 0 && typeof interestRate === 'number' && interestRate > 0 && typeof term === 'number' && term > 0) {
            const principal = amount;
            const monthlyRate = interestRate / 100;
            const numberOfMonths = term;

            // Calculate monthly payment (Annuity formula)
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
            
            if (!isFinite(monthlyPayment)) {
              setSimulation([]);
              return;
            }

            let remainingBalance = principal;
            const installments = [];

            for (let i = 1; i <= numberOfMonths; i++) {
                const interestPayment = remainingBalance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                remainingBalance -= principalPayment;
                
                // Ensure remaining balance is 0 on the last payment
                if (i === numberOfMonths || remainingBalance < 1) {
                    remainingBalance = 0;
                }

                installments.push({
                    month: i,
                    principal: principalPayment,
                    interest: interestPayment,
                    total: monthlyPayment,
                    remainingBalance: remainingBalance,
                });
            }
            setSimulation(installments);
        } else {
            setSimulation([]);
        }
    }, [amount, interestRate, term]);


    const handleNumericChange = (setter) => (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setter(value === '' ? '' : parseFloat(value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedMemberId || typeof amount !== 'number' || amount <= 0 || !loanType || typeof interestRate !== 'number' || interestRate <= 0 || typeof term !== 'number' || term <= 0 || !loanDate) {
            alert('Semua kolom harus diisi dengan benar.');
            return;
        }

        if (simulation.length === 0) {
            alert('Simulasi angsuran gagal dibuat. Periksa kembali input Anda.');
            return;
        }

        const newLoan = {
            id: crypto.randomUUID(),
            memberId: selectedMemberId,
            loanType,
            amount,
            interestRate,
            term,
            loanDate: new Date(loanDate).toISOString(),
            status: LoanStatus.AKTIF,
            installments: simulation,
        };

        onAddLoan(newLoan);
        
        // Reset form
        setSelectedMemberId('');
        setAmount('');
        setLoanType('');
        setInterestRate('');
        setTerm('');
        setLoanDate(getTodayDateString());
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengajuan Pinjaman</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Loan Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label htmlFor="member-select" className="block text-sm font-medium text-gray-700">Pilih Anggota</label>
                            <select id="member-select" value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required>
                                <option value="">-- Pilih Anggota --</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Jumlah Pinjaman</label>
                            <div className="relative mt-1">
                               <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
                               <input type="text" id="amount" value={amount === '' ? '' : amount.toLocaleString('id-ID')} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); setAmount(val === '' ? '' : parseInt(val, 10)); }} className="pl-8 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                            </div>
                        </div>
                        <div>
                           <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">Jenis Pinjaman</label>
                           <input type="text" id="loanType" value={loanType} onChange={e => setLoanType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required placeholder="Contoh: Pinjaman Usaha"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Suku Bunga (%/bln)</label>
                                <input type="number" id="interestRate" step="0.1" value={interestRate} onChange={handleNumericChange(setInterestRate)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                             </div>
                             <div>
                                <label htmlFor="term" className="block text-sm font-medium text-gray-700">Jangka Waktu (bulan)</label>
                                <input type="number" id="term" value={term} onChange={handleNumericChange(setTerm)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                             </div>
                        </div>
                         <div>
                            <label htmlFor="loanDate" className="block text-sm font-medium text-gray-700">Tanggal Pinjaman</label>
                            <input type="date" id="loanDate" value={loanDate} onChange={e => setLoanDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">Simpan Pinjaman</button>
                    </form>

                    {/* Simulation */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Simulasi Angsuran</h3>
                        <div className="overflow-x-auto max-h-[450px]">
                             <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ke-</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">Pokok</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">Bunga</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sisa</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {simulation.length > 0 ? simulation.map(item => (
                                        <tr key={item.month}>
                                            <td className="px-2 py-2 text-center text-sm">{item.month}</td>
                                            <td className="px-2 py-2 text-right text-sm">{formatCurrency(item.principal)}</td>
                                            <td className="px-2 py-2 text-right text-sm">{formatCurrency(item.interest)}</td>
                                            <td className="px-2 py-2 text-right text-sm font-semibold">{formatCurrency(item.total)}</td>
                                            <td className="px-2 py-2 text-right text-sm text-gray-600">{formatCurrency(item.remainingBalance)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-gray-500">Isi data pinjaman untuk melihat simulasi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoansPage;