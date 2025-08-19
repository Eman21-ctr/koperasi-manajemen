// src/components/EditMemberModal.jsx
import React, { useState, useEffect } from 'react';

const EditMemberModal = ({ member, onUpdate, onClose }) => {
    // Inisialisasi form state dengan data member yang ada
    const [formData, setFormData] = useState({
        ...member,
        // Pastikan format tanggal YYYY-MM-DD untuk input
        dob: new Date(member.dob.toDate ? member.dob.toDate() : member.dob).toISOString().split('T')[0]
    });

    // Handler untuk setiap perubahan di input form
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Siapkan data yang akan dikirim ke Firestore
        const { name, idNumber, pob, dob, gender, address, phone, occupation, heirName, heirRelationship } = formData;
        const updatedData = { 
            name, 
            idNumber, 
            pob, 
            dob: new Date(dob), // Kirim sebagai objek Date
            gender, 
            address, 
            phone, 
            occupation, 
            heirName, 
            heirRelationship 
        };
        
        onUpdate(member.id, updatedData); // Panggil fungsi dari App.jsx
        onClose(); // Tutup modal
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                <h3 className="text-xl font-semibold mb-6">Edit Data: {member.name}</h3>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-4">
                    {/* Contoh beberapa field yang bisa diedit */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                        <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat</label>
                        <textarea id="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                        <input type="text" id="occupation" value={formData.occupation} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    {/* Anda bisa menambahkan field lain di sini dengan pola yang sama */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMemberModal;