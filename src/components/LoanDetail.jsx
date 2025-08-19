import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../lib/helpers.js'; // Pastikan path ini benar
import { LoanStatus } from '../lib/types.js'; // Pastikan path ini benar
import { ArrowLeftIcon } from './Icons.jsx'; // Asumsi nama ikon

// Komponen Form Pembayaran Angsuran
const AddPaymentForm = ({ onAddPayment, loanId, nextInstallmentNumber }) => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            alert('Jumlah pembayaran tidak valid.');
            return;
        }
        
        const newPayment = {
            id: `PAY-${loanId}-${Date.now()}`,
            loanId: loanId,
            paymentDate: new Date(date),
            amountPaid: Number(amount),
            installmentNumber: nextInstallmentNumber,
        };

        onAddPayment(newPayment);
        setAmount(''); // Reset form
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold mb-2">Tambah Pembayaran Angsuran</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Bayar</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jumlah Bayar</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Rp 0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div className="self-end">
                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Simpan Bayar
                    </button>
                </div>
            </div>
        </form>
    );
};


const LoanDetail = ({ loan, member, payments, onAddPayment, onBack }) => {
    if (!loan || !member) {
        return <div>Memuat data pinjaman...</div>;
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const remainingBalance = loan.totalAmount - totalPaid;
    const nextInstallmentNumber = payments.length + 1;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
                <ArrowLeftIcon className="w-4 h-4" />
                Kembali ke Daftar Laporan
            </button>

            <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Detail Pinjaman: {loan.loanType}</h2>
                <p className="text-gray-600">Anggota: <span className="font-semibold">{member.name} ({member.id})</span></p>
                <p className={`text-sm font-semibold mt-1 px-2 py-0.5 inline-block rounded-full ${loan.status === LoanStatus.LUNAS ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    Status: {loan.status}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Pinjaman</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(loan.totalAmount)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Sudah Dibayar</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Sisa Pinjaman</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(remainingBalance)}</p>
                </div>
            </div>

            {loan.status === LoanStatus.AKTIF && (
                <AddPaymentForm 
                    onAddPayment={onAddPayment}
                    loanId={loan.id}
                    nextInstallmentNumber={nextInstallmentNumber}
                />
            )}
            
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Riwayat Pembayaran Angsuran</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Angsuran Ke-</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Dibayar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payments.sort((a, b) => a.installmentNumber - b.installmentNumber).map(payment => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-2 whitespace-nowrap">{payment.installmentNumber}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(payment.paymentDate)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-right font-medium">{formatCurrency(payment.amountPaid)}</td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">Belum ada pembayaran.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoanDetail;