
import React from 'react';
import { PrinterIcon, XIcon } from './Icons.jsx';
import { formatCurrency, formatDate, generateReceiptPDF } from '../lib/helpers.js';

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    generateReceiptPDF(receipt);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Struk Setoran</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="border-t border-b border-gray-200 py-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Nama Anggota:</span>
            <span className="font-medium">{receipt.memberName}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-600">Tanggal:</span>
            <span className="font-medium">{new Date(receipt.date).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="space-y-2">
            {receipt.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.description}</span>
                <span>{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-2 flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatCurrency(receipt.total)}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
          >
            <PrinterIcon className="w-5 h-5" />
            Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
