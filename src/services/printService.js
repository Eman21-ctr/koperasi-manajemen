// src/services/printService.js

// Pastikan Anda sudah menginstal library ini:
// npm install jspdf jspdf-autotable xlsx
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatDate, formatCurrency } from '../lib/helpers.js';

// Fungsi untuk mengekspor daftar anggota ke PDF
export const downloadMembersPdf = (members) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Daftar Anggota Koperasi", 14, 22);

    const tableColumn = ["ID Anggota", "Nama Lengkap", "No. Telepon", "Tanggal Bergabung"];
    const tableRows = [];

    members.forEach(member => {
        const memberData = [
            member.id,
            member.name,
            member.phone || '-', // Menangani jika no telp tidak ada
            formatDate(member.joinDate)
        ];
        tableRows.push(memberData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
    });

    doc.save(`daftar_anggota_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Fungsi untuk mengekspor daftar anggota ke Excel
export const downloadMembersXlsx = (members) => {
    const dataToExport = members.map(member => ({
        "ID Angota": member.id,
        "Nama Lengkap": member.name,
        "Alamat": member.address,
        "No. Telepon": member.phone,
        "Pekerjaan": member.occupation,
        "Tanggal Bergabung": formatDate(member.joinDate)
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Anggota");
    XLSX.writeFile(wb, `daftar_anggota_${new Date().toISOString().split('T')[0]}.xlsx`);
};