// src/lib/helpers.js

// Fungsi-fungsi ini membutuhkan library jspdf, jspdf-autotable, dan xlsx
// Pastikan Anda sudah menjalankannya: npm install jspdf jspdf-autotable xlsx
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = 0;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  const dateObj = date && typeof date.toDate === 'function' ? date.toDate() : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Tanggal tidak valid';
  }
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const generateReceiptPDF = (receipt) => {
    const doc = new jsPDF({ unit: 'mm', format: [58, 210] }); // Kertas struk thermal
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);

    let y = 7;
    const addLine = (text, options = {}) => {
        if (options.isBold) doc.setFont('courier', 'bold');
        const align = options.align || 'left';
        const x = align === 'right' ? 56 : (align === 'center' ? 29 : 2);
        doc.text(text, x, y, { align: align });
        if (options.isBold) doc.setFont('courier', 'normal');
        y += 4;
    };
    const line = () => { y += 0.5; doc.text('--------------------------', 2, y); y += 3; };

    addLine('KOPERASI SIMPAN PINJAM', { align: 'center', isBold: true });
    line();
    addLine(`Tgl: ${formatDate(receipt.date)}`);
    addLine(`Nama: ${receipt.memberName}`);
    line();

    receipt.items.forEach(item => {
        const amountStr = formatCurrency(item.amount);
        doc.text(item.description, 2, y);
        doc.text(amountStr, 56, y, { align: 'right' });
        y += 4;
    });
    line();

    doc.setFont('courier', 'bold');
    doc.text('Total', 2, y);
    doc.text(formatCurrency(receipt.total), 56, y, { align: 'right' });
    doc.setFont('courier', 'normal');
    y += 6;

    addLine('Terima kasih.', { align: 'center' });
    
    doc.output('dataurlnewwindow');
};

// Fungsi untuk ekspor ke Excel
export const exportToExcel = (data, fileName, sheetName = 'Sheet1') => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};